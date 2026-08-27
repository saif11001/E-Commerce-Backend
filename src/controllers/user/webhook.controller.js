import stripe from "../../config/stripe.js";
import { confirmStripeCheckoutService } from "../../services/user/checkout.service.js";

export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log("Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        try {
            await confirmStripeCheckoutService(paymentIntent.id);
        } catch (error) {
            console.log("Failed to process successful payment:", error.message);
        }
    }

    res.status(200).json({ received: true });
};