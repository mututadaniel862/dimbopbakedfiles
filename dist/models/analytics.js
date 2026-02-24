"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAnalyticsSchema = void 0;
const zod_1 = require("zod");
exports.userAnalyticsSchema = zod_1.z.object({
    user_id: zod_1.z.number().optional().nullable(),
    browser: zod_1.z.string().max(50).optional(),
    device: zod_1.z.string().max(50).optional(),
    created_at: zod_1.z.date().optional(),
});
//# sourceMappingURL=analytics.js.map