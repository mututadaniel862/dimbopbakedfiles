import { UploadedFile } from '../types/file';
/**
 * Enhanced AI function that handles text, images, and audio
 */
export declare const askPhoneAI: (query: string, imageFile?: UploadedFile, audioFile?: UploadedFile) => Promise<string>;
/**
 * Enhanced report generation with real database data
 */
export declare const generateReport: (reportType: string, startDate?: string, endDate?: string) => Promise<string>;
