import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExtractedRecord } from "@shared/schema";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function extractDataFromImage(
  imageBase64: string,
  fileName: string,
  mimeType: string = "image/jpeg"
): Promise<ExtractedRecord[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `أنت خبير في قراءة النصوص العربية المكتوبة بخط اليد. يرجى تحليل هذه الصورة واستخراج جميع الأسماء الكاملة والأرقام القومية (الرقم الوطني).

الرجاء الرد بصيغة JSON فقط بدون أي نص إضافي، كالتالي:
{
  "records": [
    {
      "name": "الاسم الكامل بالعربية",
      "nationalId": "الرقم القومي (14 رقم)"
    }
  ]
}

ملاحظات مهمة:
- الرقم القومي يجب أن يكون 14 رقم فقط
- استخرج جميع الأسماء والأرقام من الصورة
- إذا لم تجد بيانات واضحة، أرجع مصفوفة فارغة
- تأكد من دقة البيانات المستخرجة`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response text
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to parse the JSON response
    const parsed = JSON.parse(cleanText);
    
    if (!parsed.records || !Array.isArray(parsed.records)) {
      console.error("Invalid response format from Gemini:", parsed);
      return [];
    }

    // Convert to our schema format
    const records: ExtractedRecord[] = parsed.records.map((record: any, index: number) => ({
      id: `${fileName}-${Date.now()}-${index}`,
      name: record.name || "",
      nationalId: record.nationalId || "",
      sourceImageId: fileName,
    }));

    return records;
  } catch (error) {
    console.error("Error extracting data from image:", error);
    throw new Error(`فشل في معالجة الصورة: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
  }
}
