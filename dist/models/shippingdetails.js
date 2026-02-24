"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingDetailsSchema = void 0;
const zod_1 = require("zod");
exports.shippingDetailsSchema = zod_1.z.object({
    user_id: zod_1.z.number().optional().nullable(),
    full_name: zod_1.z.string().max(255),
    country: zod_1.z.string().max(100),
    city: zod_1.z.string().max(100),
    street: zod_1.z.string().max(255),
    apartment: zod_1.z.string().max(255).optional(),
    postal_code: zod_1.z.string().max(20),
    phone: zod_1.z.string().max(20),
    email: zod_1.z.string().email().max(255),
    created_at: zod_1.z.date().optional(),
    user: zod_1.z.object({
        id: zod_1.z.number(),
        email: zod_1.z.string().email()
    }).optional()
});
//# sourceMappingURL=shippingdetails.js.map