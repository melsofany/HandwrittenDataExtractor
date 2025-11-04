import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { extractDataFromImage } from "./services/gemini";
import { createGoogleSheet } from "./services/googleSheets";
import type { ExtractedRecord } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Process single image
  app.post("/api/process-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: "لم يتم رفع أي صورة" 
        });
      }

      // Convert buffer to base64
      const imageBase64 = req.file.buffer.toString('base64');
      const fileName = req.file.originalname;

      // Extract data using Gemini
      const records = await extractDataFromImage(imageBase64, fileName);

      res.json({
        success: true,
        records,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "خطأ في معالجة الصورة",
      });
    }
  });

  // Process multiple images
  app.post("/api/process-images", upload.array("images", 40), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "لم يتم رفع أي صور" 
        });
      }

      const allRecords: ExtractedRecord[] = [];
      const results: Array<{ fileName: string; success: boolean; recordCount: number; error?: string }> = [];

      // Process each image
      for (const file of files) {
        try {
          const imageBase64 = file.buffer.toString('base64');
          const records = await extractDataFromImage(imageBase64, file.originalname);
          
          allRecords.push(...records);
          results.push({
            fileName: file.originalname,
            success: true,
            recordCount: records.length,
          });
        } catch (error) {
          results.push({
            fileName: file.originalname,
            success: false,
            recordCount: 0,
            error: error instanceof Error ? error.message : "خطأ في المعالجة",
          });
        }
      }

      res.json({
        success: true,
        records: allRecords,
        results,
      });
    } catch (error) {
      console.error("Error processing images:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "خطأ في معالجة الصور",
      });
    }
  });

  // Create Google Sheet
  app.post("/api/create-sheet", async (req, res) => {
    try {
      const { records, sheetName } = req.body;

      if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          error: "لا توجد بيانات لحفظها",
        });
      }

      const result = await createGoogleSheet(records, sheetName);

      res.json({
        success: true,
        sheetUrl: result.sheetUrl,
        sheetId: result.sheetId,
      });
    } catch (error) {
      console.error("Error creating Google Sheet:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "خطأ في إنشاء Google Sheet",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
