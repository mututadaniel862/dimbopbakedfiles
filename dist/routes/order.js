"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controllers/orders/controller");
const schemas_1 = require("../utils/schemas");
const order_1 = require("../models/order");
exports.default = async (app) => {
    // Get all orders
    app.get('/', controller_1.OrderController.getAllOrders);
    // Get specific order
    app.get('/:id', controller_1.OrderController.getOrderById);
    // Create new order
    app.post('/neworder', {
        handler: controller_1.OrderController.createOrder,
        schema: {
            body: (0, schemas_1.zodToJsonSchema)(order_1.orderSchema)
        }
    });
    // Update order
    app.put('/:id', {
        handler: controller_1.OrderController.updateOrder,
        schema: {
            body: (0, schemas_1.zodToJsonSchema)(order_1.orderSchema.partial())
        }
    });
    // Delete order
    app.delete('/:id', controller_1.OrderController.deleteOrder);
};
//# sourceMappingURL=order.js.map