"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controllers/users/controller");
exports.default = async (fastify) => {
    // Get all users who made purchases
    fastify.get('/purchasers', controller_1.UserPurchaseController.getAllPurchasers);
    // Get specific user's purchase history
    fastify.get('/:userId/purchases', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            }
        },
        handler: controller_1.UserPurchaseController.getUserPurchases
    });
    // Create new order with payment
    fastify.post('/orders', controller_1.UserPurchaseController.createOrder);
    // Get specific order
    fastify.get('/orders/:orderId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    orderId: { type: 'string' }
                },
                required: ['orderId']
            }
        },
        handler: controller_1.UserPurchaseController.getOrder
    });
    // EcoCash payment callback
    fastify.post('/payment/callback', controller_1.UserPurchaseController.handlePaymentCallback);
    // Get purchase statistics
    fastify.get('/statistics/purchases', controller_1.UserPurchaseController.getStatistics);
};
//# sourceMappingURL=user.js.map