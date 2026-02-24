"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueSchema = exports.financialSchema = exports.financialTypeEnum = void 0;
const zod_1 = require("zod");
exports.financialTypeEnum = zod_1.z.enum([
    "income",
    "expense",
    "refund",
    "tax",
    "shipping"
]);
exports.financialSchema = zod_1.z.object({
    order_id: zod_1.z.number().nullable().optional(),
    type: zod_1.z.string().optional(),
    amount: zod_1.z.number(),
    description: zod_1.z.string().optional(),
    created_at: zod_1.z.coerce.date().optional(),
});
exports.revenueSchema = zod_1.z.object({
    total_income: zod_1.z.number().default(0),
    total_expense: zod_1.z.number().default(0),
    report_month: zod_1.z.date()
});
//# sourceMappingURL=finacial.js.map