"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    order_id: zod_1.z.number().optional().nullable(),
    user_id: zod_1.z.number().optional().nullable(),
    payment_method: zod_1.z.string().max(50).optional(),
    transaction_id: zod_1.z.string().max(255),
    customerMsisdn: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().max(50).default("Pending"),
    // created_at: z.date().optional(),
});
//# sourceMappingURL=payment.js.map