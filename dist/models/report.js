"use strict";
// import {z} from "zod"
// export const reportTypeEnum = z.enum([
//     "monthly",
//     "annual",
//     "financial",
//     "user_activity",
//     "inventory",
//     "custom"
//   ]);
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = exports.reportTypeEnum = void 0;
//   export const reportSchema = z.object({
//     report_type: reportTypeEnum.optional(),
//     report_content: z.string().optional(),
//     report_date: z.date().optional()
//   });
//   export type Report = z.infer<typeof reportSchema>;
const zod_1 = require("zod");
exports.reportTypeEnum = zod_1.z.enum([
    'monthly',
    'annual',
    'financial',
    'user_activity',
    'inventory',
    'custom',
    'multimedia',
]);
exports.reportSchema = zod_1.z.object({
    report_type: exports.reportTypeEnum.optional(),
    report_content: zod_1.z.string().optional(),
    report_date: zod_1.z.date().optional(),
    user_id: zod_1.z.number().int().positive().optional(),
});
//# sourceMappingURL=report.js.map