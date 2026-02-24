"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multimediaQuerySchema = void 0;
const zod_1 = require("zod");
exports.multimediaQuerySchema = zod_1.z.object({
    user_id: zod_1.z.number().int().positive().optional(),
    file_type: zod_1.z.enum(['pdf', 'image', 'audio', 'video', 'document']).optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
});
//# sourceMappingURL=queryschema.js.map