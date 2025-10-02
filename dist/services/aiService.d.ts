import { UploadedFile } from '../types/file';
/**
 * Enhanced AI function with dynamic database search
 */
export declare const askPhoneAI: (query: string, imageFile?: UploadedFile, audioFile?: UploadedFile) => Promise<string>;
export declare const generateReport: (reportType: string, startDate?: string, endDate?: string) => Promise<string>;
