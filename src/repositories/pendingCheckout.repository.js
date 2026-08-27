import { PendingCheckout } from "../models/pendingCheckout.model.js";

export const createPendingCheckout = (data) => {
    return PendingCheckout.create(data);
};

export const findPendingCheckoutByPaymentIntentId = (stripePaymentIntentId) => {
    return PendingCheckout.findOne({ stripePaymentIntentId });
};

export const deletePendingCheckoutById = (id) => {
    return PendingCheckout.findByIdAndDelete(id);
};