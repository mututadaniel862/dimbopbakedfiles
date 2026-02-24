"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    // id: z.number(),
    order_id: zod_1.z.number().nullable().optional(),
    product_id: zod_1.z.number().nullable().optional(),
    quantity: zod_1.z.number(),
    price: zod_1.z.number() // Prisma Decimal
});
//# sourceMappingURL=orderitem.js.map