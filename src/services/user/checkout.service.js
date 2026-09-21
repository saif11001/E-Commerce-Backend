import stripe from "../../config/stripe.js";
import AppError from "../../utils/AppError.js";
import { findCartByUser, findCartByCartId } from "../../repositories/cart.repository.js";
import { decrementProductStockIfAvailable, incrementProductStock } from "../../repositories/product.repository.js";
import { registerCouponUsage } from "../../repositories/coupon.repository.js";
import { findShippingZoneByGovernorate } from "../../repositories/shippingZone.repository.js";
import { createOrder, findOrderByPaymentIntentId } from "../../repositories/order.repository.js";
import { createPendingCheckout, findPendingCheckoutByPaymentIntentId, deletePendingCheckoutById } from "../../repositories/pendingCheckout.repository.js";
import { clearCartService } from "./cart.service.js";
import { sendOrderConfirmationEmail } from "../../nodemailer/emails.js";

const buildCheckoutSummary = async (cart, shippingInfo, { userId } = {}) => {
    if (!cart || cart.items.length === 0) {
        throw new AppError("Your cart is empty", 400);
    }

    const orderItems = [];
    let itemsPrice = 0;

    for (const item of cart.items) {
        const product = item.product;
        if (!product || !product.isActive) {
            throw new AppError(`Product "${product?.name || "unknown"}" is no longer available`, 400);
        }

        const price = product.discountPrice > 0
            ? product.price - product.discountPrice
            : product.price;
        itemsPrice += price * item.quantity;

        orderItems.push({
            product: product._id,
            name: product.name,
            price,
            quantity: item.quantity,
            size: item.size,
            image: product.images?.[0]?.url || null
        });
    }

    let discount = 0;
    let couponData = { couponId: null, code: null, discount: 0 };
    if (cart.coupon) {
        const email = shippingInfo.email?.toLowerCase();
        const alreadyUsed = cart.coupon.usedBy?.some((entry) => {
            if (userId && entry.userId) {
                return entry.userId.toString() === userId;
            }
            if (email && entry.email) {
                return entry.email === email;
            }
            return false;
        });

        if (alreadyUsed) {
            throw new AppError("You have already used this coupon", 400);
        }

        if (cart.coupon.discountType === "percentage") {
            discount = (itemsPrice * cart.coupon.discountValue) / 100;
        } else {
            discount = cart.coupon.discountValue;
        }
        discount = Math.min(discount, itemsPrice);
        couponData = { couponId: cart.coupon._id, code: cart.coupon.code, discount };
    }

    const zone = await findShippingZoneByGovernorate(shippingInfo.governorate);
    if (!zone || !zone.isActive) {
        throw new AppError("Shipping is not available for this governorate", 400);
    }
    const shippingPrice = zone.shippingCost;

    const totalPrice = Math.max(itemsPrice - discount, 0) + shippingPrice;

    return { orderItems, itemsPrice, shippingPrice, totalPrice, couponData, coupon: cart.coupon };
};

const reserveStockOrThrow = async (orderItems) => {
    const reserved = [];

    for (const item of orderItems) {
        const updated = await decrementProductStockIfAvailable(item.product, item.quantity);

        if (!updated) {
            for (const done of reserved) {
                await incrementProductStock(done.product, done.quantity);
            }
            throw new AppError(`"${item.name}" is no longer available in the requested quantity`, 400);
        }

        reserved.push(item);
    }
};

export const getCheckoutPreviewService = async ({ userId, cartId, shippingInfo }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    const { itemsPrice, shippingPrice, totalPrice, couponData } = await buildCheckoutSummary(cart, shippingInfo, { userId });

    return { itemsPrice, shippingPrice, totalPrice, coupon: couponData };
};

export const processCodCheckoutService = async ({ userId, cartId, shippingInfo }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    const { orderItems, itemsPrice, shippingPrice, totalPrice, couponData, coupon } = await buildCheckoutSummary(cart, shippingInfo, { userId });

    await reserveStockOrThrow(orderItems);

    let order;
    try {
        order = await createOrder({
            user: userId || null,
            items: orderItems,
            shippingInfo,
            paymentMethod: "cod",
            isPaid: false,
            coupon: couponData,
            itemsPrice,
            shippingPrice,
            totalPrice,
            orderStatus: "pending"
        });
    } catch (error) {
        for (const item of orderItems) {
            await incrementProductStock(item.product, item.quantity);
        }
        throw error;
    }

    if (coupon) {
        await registerCouponUsage(coupon._id, { userId, email: shippingInfo.email });
    }

    await clearCartService({ userId, cartId });

    try {
        await sendOrderConfirmationEmail({ email: shippingInfo.email, name: shippingInfo.fullName, order });
    } catch (emailError) {
        console.log("Failed to send order confirmation email:", emailError.message);
    }

    return order;
};

export const createStripePaymentIntentService = async ({ userId, cartId, shippingInfo }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    const { orderItems, itemsPrice, shippingPrice, totalPrice, couponData } = await buildCheckoutSummary(cart, shippingInfo, { userId });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "egp",
        automatic_payment_methods: { enabled: true }
    });

    await createPendingCheckout({
        stripePaymentIntentId: paymentIntent.id,
        user: userId || null,
        cartId: userId ? null : cartId,
        items: orderItems,
        shippingInfo,
        coupon: couponData,
        itemsPrice,
        shippingPrice,
        totalPrice
    });

    return { clientSecret: paymentIntent.client_secret };
};

export const confirmStripeCheckoutService = async (paymentIntentId) => {
    const existingOrder = await findOrderByPaymentIntentId(paymentIntentId);
    if (existingOrder) {
        console.log(`Order already exists for payment ${paymentIntentId}, skipping`);
        return existingOrder;
    }
    
    const pending = await findPendingCheckoutByPaymentIntentId(paymentIntentId);
    if (!pending) {
        console.log(`No pending checkout found for paymentIntent ${paymentIntentId}, possibly already processed`);
        return;
    }

    try {
        await reserveStockOrThrow(pending.items);
    } catch (error) {
        console.error(`CRITICAL: Payment ${paymentIntentId} succeeded but stock unavailable. Needs manual refund/review.`, error.message);
        throw error;
    }

    let order;
    try {
        order = await createOrder({
            user: pending.user,
            items: pending.items,
            shippingInfo: pending.shippingInfo,
            paymentMethod: "stripe",
            isPaid: true,
            paidAt: Date.now(),
            stripePaymentIntentId: pending.stripePaymentIntentId,
            coupon: pending.coupon,
            itemsPrice: pending.itemsPrice,
            shippingPrice: pending.shippingPrice,
            totalPrice: pending.totalPrice,
            orderStatus: "pending"
        });
    } catch (error) {
        for (const item of pending.items) {
            await incrementProductStock(item.product, item.quantity);
        }
        throw error;
    }

    if (pending.coupon?.couponId) {
        await registerCouponUsage(pending.coupon.couponId, {
            userId: pending.user,
            email: pending.shippingInfo.email
        });
    }

    await clearCartService({
        userId: pending.user ? pending.user.toString() : null,
        cartId: pending.cartId
    });

    await deletePendingCheckoutById(pending._id);

    try {
        await sendOrderConfirmationEmail({
            email: pending.shippingInfo.email,
            name: pending.shippingInfo.fullName,
            order
        });
    } catch (emailError) {
        console.log("Failed to send order confirmation email:", emailError.message);
    }

    return order;
};