"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const zod_1 = require("zod");
exports.cartSchema = zod_1.z.object({
    user_id: zod_1.z.number().nullable().optional(),
    product_id: zod_1.z.number().nullable().optional(),
    quantity: zod_1.z.number(),
    created_at: zod_1.z.coerce.date().optional()
});
//# sourceMappingURL=cart.js.map