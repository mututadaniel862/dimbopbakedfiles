"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBulkAnalysis = exports.handleGenerateReport = exports.handleUserQuery = void 0;
const Aischema_1 = require("../../models/Aischema");
const aiService_1 = require("../../services/aiService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("stream/promises");
const fs_2 = require("fs");
const UPLOADS_DIR = path_1.default.join(process.cwd(), 'Uploads', 'ai');
// Ensure AI uploads directory exists
const ensureUploadDir = async () => {
    try {
        await fs_1.default.promises.mkdir(UPLOADS_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Error creating AI uploads directory:', error);
    }
};
const handleUserQuery = async (req, reply) => {
    try {
        console.log('🤖 AI Query Handler - Processing request');
        console.log('Content-Type:', req.headers['content-type']);
        let query = '';
        let imageFile;
        let audioFile;
        // Check if request is multipart
        if (req.isMultipart()) {
            console.log('📦 Processing multipart request');
            await ensureUploadDir();
            const parts = req.parts();
            for await (const part of parts) {
                if (part.type === 'field') {
                    // Handle form fields
                    if (part.fieldname === 'query') {
                        query = part.value;
                    }
                }
                else if (part.type === 'file') {
                    // Handle file uploads
                    console.log('📁 Processing uploaded file:', part.filename);
                    const fileExtension = path_1.default.extname(part.filename || '').toLowerCase();
                    const fileName = `${Date.now()}-${part.filename}`;
                    const filePath = path_1.default.join(UPLOADS_DIR, fileName);
                    // Save file
                    await (0, promises_1.pipeline)(part.file, (0, fs_2.createWriteStream)(filePath));
                    // Create UploadedFile object
                    const uploadedFile = {
                        filename: fileName,
                        originalname: part.filename || 'unknown',
                        path: filePath,
                        mimetype: part.mimetype,
                        size: fs_1.default.statSync(filePath).size
                    };
                    // Determine file type
                    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
                        imageFile = uploadedFile;
                        console.log('🖼️ Image file detected');
                    }
                    else if (['.mp3', '.wav', '.m4a', '.ogg'].includes(fileExtension)) {
                        audioFile = uploadedFile;
                        console.log('🎵 Audio file detected');
                    }
                    else {
                        // Clean up unsupported file
                        fs_1.default.unlinkSync(filePath);
                        return reply.code(400).send({
                            success: false,
                            error: 'Unsupported file type. Please upload images (jpg, png, gif, webp) or audio files (mp3, wav, m4a, ogg).'
                        });
                    }
                }
            }
        }
        else {
            // Handle JSON request
            console.log('📝 Processing JSON request');
            try {
                const { query: jsonQuery } = Aischema_1.aiQuerySchema.parse(req.body);
                query = jsonQuery;
            }
            catch (validationError) {
                return reply.code(400).send({
                    success: false,
                    error: `Validation error: ${validationError.message}`
                });
            }
        }
        // Validate query
        if (!query && !imageFile && !audioFile) {
            return reply.code(400).send({
                success: false,
                error: 'Please provide a query text, image, or audio file.'
            });
        }
        console.log('🔥 Calling askPhoneAI with:', {
            query: query || 'Analyze this media file',
            hasImage: !!imageFile,
            hasAudio: !!audioFile
        });
        // Call AI service
        const answer = await (0, aiService_1.askPhoneAI)(query || 'Analyze this media file', imageFile, audioFile);
        // Clean up uploaded files after processing
        if (imageFile && fs_1.default.existsSync(imageFile.path)) {
            fs_1.default.unlinkSync(imageFile.path);
        }
        if (audioFile && fs_1.default.existsSync(audioFile.path)) {
            fs_1.default.unlinkSync(audioFile.path);
        }
        return reply.send({
            success: true,
            message: answer
        });
    }
    catch (error) {
        console.error('🚨 AI Query Error:', error);
        return reply.code(500).send({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};
exports.handleUserQuery = handleUserQuery;
const handleGenerateReport = async (req, reply) => {
    try {
        console.log('📊 Report Generation Handler - Processing request');
        const { report_type, start_date, end_date } = req.body;
        // Validate report type
        const validReportTypes = [
            'products', 'product-sales', 'inventory',
            'users', 'user-activity', 'customers',
            'blogs', 'content', 'articles',
            'sales', 'revenue', 'financial',
            'general', 'overview'
        ];
        if (!report_type || !validReportTypes.includes(report_type.toLowerCase())) {
            return reply.code(400).send({
                success: false,
                error: `Invalid report type. Supported types: ${validReportTypes.join(', ')}`
            });
        }
        const report = await (0, aiService_1.generateReport)(report_type, start_date, end_date);
        return reply.send({
            success: true,
            message: report,
            report_type,
            start_date,
            end_date
        });
    }
    catch (error) {
        console.error('🚨 Report Generation Error:', error);
        return reply.code(500).send({
            success: false,
            error: error.message || 'Report generation failed'
        });
    }
};
exports.handleGenerateReport = handleGenerateReport;
// New handler for bulk analysis
const handleBulkAnalysis = async (req, reply) => {
    try {
        console.log('📊 Bulk Analysis Handler - Processing request');
        const report = await (0, aiService_1.generateReport)('general');
        const productSummary = await (0, aiService_1.generateReport)('products');
        const userSummary = await (0, aiService_1.generateReport)('users');
        const analysis = `🤖 **DIMBOP AI BULK ANALYSIS**

${report}

---

${productSummary}

---

${userSummary}

---
*Complete analysis generated by Dimbop AI*`;
        return reply.send({
            success: true,
            message: analysis,
            type: 'bulk_analysis'
        });
    }
    catch (error) {
        console.error('🚨 Bulk Analysis Error:', error);
        return reply.code(500).send({
            success: false,
            error: error.message || 'Bulk analysis failed'
        });
    }
};
exports.handleBulkAnalysis = handleBulkAnalysis;
//# sourceMappingURL=aiController.js.map