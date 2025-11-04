import { z } from "zod";

export const extractedRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  nationalId: z.string(),
  sourceImageId: z.string().optional(),
});

export type ExtractedRecord = z.infer<typeof extractedRecordSchema>;

export const processImageRequestSchema = z.object({
  imageData: z.string(),
  fileName: z.string(),
});

export type ProcessImageRequest = z.infer<typeof processImageRequestSchema>;

export const processImageResponseSchema = z.object({
  success: z.boolean(),
  records: z.array(extractedRecordSchema),
  error: z.string().optional(),
});

export type ProcessImageResponse = z.infer<typeof processImageResponseSchema>;

export const createSheetRequestSchema = z.object({
  records: z.array(extractedRecordSchema),
  sheetName: z.string().optional(),
});

export type CreateSheetRequest = z.infer<typeof createSheetRequestSchema>;

export const createSheetResponseSchema = z.object({
  success: z.boolean(),
  sheetUrl: z.string().optional(),
  sheetId: z.string().optional(),
  error: z.string().optional(),
});

export type CreateSheetResponse = z.infer<typeof createSheetResponseSchema>;
