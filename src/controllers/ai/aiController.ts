// import { FastifyRequest, FastifyReply } from 'fastify';
// import { aiQuerySchema, aiResponseSchema } from '../../models/Aischema';
// import { askPhoneAI, generateReport } from '../../services/aiService';

// export const handleUserQuery = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { query } = aiQuerySchema.parse(req.body);
//     const answer = await askPhoneAI(query);
//     reply.send({ message: answer });
//   } catch (error: any) {
//     reply.code(400).send({ success: false, error: error.message });
//   }
// };

// export const handleGenerateReport = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { report_type, start_date, end_date } = req.body as {
//       report_type: string;
//       start_date?: string;
//       end_date?: string;
//     };

//     // Optional validation with Zod
//     aiResponseSchema.parse({ message: 'temp', report_type, start_date, end_date });

//     const report = await generateReport(report_type, start_date, end_date);
//     reply.send({ message: report });
//   } catch (error: any) {
//     reply.code(400).send({ success: false, error: error.message });
//   }
// };











// import { FastifyRequest, FastifyReply } from 'fastify';
// import { aiQuerySchema, aiResponseSchema } from '../../models/Aischema';
// import { askPhoneAI, generateReport } from '../../services/aiService';
// import { UploadedFile } from '../../types/file';
// import path from 'path';
// import fs from 'fs';
// import { pipeline } from 'stream/promises';
// import { createWriteStream } from 'fs';

// const UPLOADS_DIR = path.join(process.cwd(), 'Uploads', 'ai');

// // Ensure AI uploads directory exists
// const ensureUploadDir = async () => {
//   try {
//     await fs.promises.mkdir(UPLOADS_DIR, { recursive: true });
//   } catch (error) {
//     console.error('Error creating AI uploads directory:', error);
//   }
// };

// export const handleUserQuery = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     console.log('🤖 AI Query Handler - Processing request');
    
//     // Handle multipart form data (text + files)
//     const data = await req.file();
//     if (!data) {
//       // Handle JSON request (text only)
//       const { query } = aiQuerySchema.parse(req.body);
//       const answer = await askPhoneAI(query);
//       return reply.send({ message: answer });
//     }

//     // Process multipart form data
//     await ensureUploadDir();
    
//     let query = '';
//     let imageFile: UploadedFile | undefined;
//     let audioFile: UploadedFile | undefined;

//     // Extract query from fields
//     const fields = data.fields as any;
//     for (const key in fields) {
//       if (key === 'query' && fields[key] && 'value' in fields[key]) {
//         query = fields[key].value;
//         break;
//       }
//     }

//     // Handle file upload
//     if (data.file && data.filename) {
//       console.log('📁 Processing uploaded file:', data.filename);
      
//       const fileExtension = path.extname(data.filename).toLowerCase();
//       const fileName = `${Date.now()}-${data.filename}`;
//       const filePath = path.join(UPLOADS_DIR, fileName);

//       // Save file
//       await pipeline(data.file, createWriteStream(filePath));
      
//       // Determine file type and create UploadedFile object
//       const uploadedFile: UploadedFile = {
//         filename: fileName,
//         originalname: data.filename,
//         path: filePath,
//         mimetype: data.mimetype,
//         size: fs.statSync(filePath).size
//       };

//       if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
//         imageFile = uploadedFile;
//         console.log('🖼️ Image file detected');
//       } else if (['.mp3', '.wav', '.m4a', '.ogg'].includes(fileExtension)) {
//         audioFile = uploadedFile;
//         console.log('🎵 Audio file detected');
//       } else {
//         return reply.code(400).send({ 
//           success: false, 
//           error: 'Unsupported file type. Please upload images (jpg, png, gif, webp) or audio files (mp3, wav, m4a, ogg).' 
//         });
//       }
//     }

//     if (!query && !imageFile && !audioFile) {
//       return reply.code(400).send({ 
//         success: false, 
//         error: 'Please provide a query text, image, or audio file.' 
//       });
//     }

//     console.log('🔥 Calling askPhoneAI with:', { query, hasImage: !!imageFile, hasAudio: !!audioFile });
    
//     const answer = await askPhoneAI(query || 'Analyze this media file', imageFile, audioFile);

//     // Clean up uploaded files after processing
//     if (imageFile && fs.existsSync(imageFile.path)) {
//       fs.unlinkSync(imageFile.path);
//     }
//     if (audioFile && fs.existsSync(audioFile.path)) {
//       fs.unlinkSync(audioFile.path);
//     }

//     reply.send({ message: answer });
//   } catch (error: any) {
//     console.error('🚨 AI Query Error:', error);
//     reply.code(400).send({ success: false, error: error.message });
//   }
// };

// export const handleGenerateReport = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     console.log('📊 Report Generation Handler - Processing request');
    
//     const { report_type, start_date, end_date } = req.body as {
//       report_type: string;
//       start_date?: string;
//       end_date?: string;
//     };

//     // Validate report type
//     const validReportTypes = [
//       'products', 'product-sales', 'inventory',
//       'users', 'user-activity', 'customers',
//       'blogs', 'content', 'articles',
//       'sales', 'revenue', 'financial',
//       'general', 'overview'
//     ];

//     if (!validReportTypes.includes(report_type.toLowerCase())) {
//       return reply.code(400).send({
//         success: false,
//         error: `Invalid report type. Supported types: ${validReportTypes.join(', ')}`
//       });
//     }

//     const report = await generateReport(report_type, start_date, end_date);
//     reply.send({ message: report, report_type, start_date, end_date });
//   } catch (error: any) {
//     console.error('🚨 Report Generation Error:', error);
//     reply.code(400).send({ success: false, error: error.message });
//   }
// };

// // New handler for bulk analysis
// export const handleBulkAnalysis = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     console.log('📊 Bulk Analysis Handler - Processing request');
    
//     const report = await generateReport('general');
//     const productSummary = await generateReport('products');
//     const userSummary = await generateReport('users');
    
//     const analysis = `🤖 **DIMBOP AI BULK ANALYSIS**

// ${report}

// ---

// ${productSummary}

// ---

// ${userSummary}

// ---
// *Complete analysis generated by Dimbop AI*`;

//     reply.send({ message: analysis, type: 'bulk_analysis' });
//   } catch (error: any) {
//     console.error('🚨 Bulk Analysis Error:', error);
//     reply.code(500).send({ success: false, error: error.message });
//   }
// };














import { FastifyRequest, FastifyReply } from 'fastify';
import { aiQuerySchema, aiResponseSchema } from '../../models/Aischema';
import { askPhoneAI, generateReport } from '../../services/aiService';
import { UploadedFile } from '../../types/file';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const UPLOADS_DIR = path.join(process.cwd(), 'Uploads', 'ai');

// Ensure AI uploads directory exists
const ensureUploadDir = async () => {
  try {
    await fs.promises.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating AI uploads directory:', error);
  }
};

export const handleUserQuery = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('🤖 AI Query Handler - Processing request');
    console.log('Content-Type:', req.headers['content-type']);

    let query = '';
    let imageFile: UploadedFile | undefined;
    let audioFile: UploadedFile | undefined;

    // Check if request is multipart
    if (req.isMultipart()) {
      console.log('📦 Processing multipart request');
      await ensureUploadDir();
      
      const parts = req.parts();
      
      for await (const part of parts) {
        if (part.type === 'field') {
          // Handle form fields
          if (part.fieldname === 'query') {
            query = part.value as string;
          }
        } else if (part.type === 'file') {
          // Handle file uploads
          console.log('📁 Processing uploaded file:', part.filename);
          
          const fileExtension = path.extname(part.filename || '').toLowerCase();
          const fileName = `${Date.now()}-${part.filename}`;
          const filePath = path.join(UPLOADS_DIR, fileName);

          // Save file
          await pipeline(part.file, createWriteStream(filePath));
          
          // Create UploadedFile object
          const uploadedFile: UploadedFile = {
            filename: fileName,
            originalname: part.filename || 'unknown',
            path: filePath,
            mimetype: part.mimetype,
            size: fs.statSync(filePath).size
          };

          // Determine file type
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
            imageFile = uploadedFile;
            console.log('🖼️ Image file detected');
          } else if (['.mp3', '.wav', '.m4a', '.ogg'].includes(fileExtension)) {
            audioFile = uploadedFile;
            console.log('🎵 Audio file detected');
          } else {
            // Clean up unsupported file
            fs.unlinkSync(filePath);
            return reply.code(400).send({ 
              success: false, 
              error: 'Unsupported file type. Please upload images (jpg, png, gif, webp) or audio files (mp3, wav, m4a, ogg).' 
            });
          }
        }
      }
    } else {
      // Handle JSON request
      console.log('📝 Processing JSON request');
      try {
        const { query: jsonQuery } = aiQuerySchema.parse(req.body);
        query = jsonQuery;
      } catch (validationError: any) {
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
    const answer = await askPhoneAI(query || 'Analyze this media file', imageFile, audioFile);

    // Clean up uploaded files after processing
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
    if (audioFile && fs.existsSync(audioFile.path)) {
      fs.unlinkSync(audioFile.path);
    }

    return reply.send({ 
      success: true, 
      message: answer 
    });

  } catch (error: any) {
    console.error('🚨 AI Query Error:', error);
    return reply.code(500).send({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
};

export const handleGenerateReport = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('📊 Report Generation Handler - Processing request');
    
    const { report_type, start_date, end_date } = req.body as {
      report_type: string;
      start_date?: string;
      end_date?: string;
    };

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

    const report = await generateReport(report_type, start_date, end_date);
    
    return reply.send({ 
      success: true,
      message: report, 
      report_type, 
      start_date, 
      end_date 
    });

  } catch (error: any) {
    console.error('🚨 Report Generation Error:', error);
    return reply.code(500).send({ 
      success: false, 
      error: error.message || 'Report generation failed' 
    });
  }
};

// New handler for bulk analysis
export const handleBulkAnalysis = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('📊 Bulk Analysis Handler - Processing request');
    
    const report = await generateReport('general');
    const productSummary = await generateReport('products');
    const userSummary = await generateReport('users');
    
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

  } catch (error: any) {
    console.error('🚨 Bulk Analysis Error:', error);
    return reply.code(500).send({ 
      success: false, 
      error: error.message || 'Bulk analysis failed' 
    });
  }
};