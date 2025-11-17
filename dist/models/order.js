"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const zod_1 = require("zod");
const orderitem_1 = require("./orderitem");
const finacial_1 = require("./finacial");
const payment_1 = require("./payment");
exports.orderSchema = zod_1.z.object({
    user_id: zod_1.z.number().nullable().optional(),
    total_price: zod_1.z.number().positive("Total price must be positive"),
    status: zod_1.z.string().default("Pending"), // Replaced with a plain string type
    // created_at: z.coerce.date(),
    created_at: zod_1.z.coerce.date().optional(),
    browser_used: zod_1.z.string().optional(),
    updated_at: zod_1.z.coerce.date().optional(),
    order_items: zod_1.z.array(orderitem_1.orderItemSchema).optional(),
    financials: zod_1.z.array(finacial_1.financialSchema).optional(),
    payments: zod_1.z.array(payment_1.paymentSchema).optional(),
});
//# sourceMappingURL=order.js.map