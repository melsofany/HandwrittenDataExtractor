import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExtractedRecord } from "@shared/schema";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apiKey);

function normalizeArabicNumbers(text: string): string {
  const arabicToEnglish: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  return text.replace(/[٠-٩]/g, (match) => arabicToEnglish[match] || match);
}

function cleanNationalId(nationalId: string): string {
  let cleaned = normalizeArabicNumbers(nationalId);
  cleaned = cleaned.replace(/[^\d]/g, '');
  return cleaned;
}

export async function extractDataFromImage(
  imageBase64: string,
  fileName: string,
  mimeType: string = "image/jpeg"
): Promise<ExtractedRecord[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `أنت خبير متخصص في قراءة الوثائق العربية المكتوبة بخط اليد بدقة عالية جداً. مهمتك هي استخراج الأسماء الكاملة والأرقام القومية من هذه الصورة بدقة 100%.

**تعليمات مهمة للحصول على أفضل دقة:**

1. **قراءة النصوص بعناية فائقة:**
   - اقرأ كل حرف وكل رقم بدقة شديدة
   - انتبه للتشابه بين الحروف (ح/خ/ج، س/ش، ع/غ، ص/ض، ط/ظ)
   - راجع كل سطر مرتين للتأكد من الدقة

2. **الأرقام القومية:**
   - معظم الأرقام القومية تكون 14 رقماً، لكن قد تجد أرقام بـ 13 أو 15 رقم
   - استخرج الرقم كما هو مكتوب بالضبط
   - حوّل أي أرقام عربية هندية (٠١٢٣٤٥٦٧٨٩) إلى أرقام إنجليزية (0123456789)
   - تأكد من عدم الخلط بين الأرقام المتشابهة (0/8, 1/7, 5/6, 2/3)

3. **الأسماء الكاملة:**
   - استخرج الاسم الكامل كما هو مكتوب تماماً
   - احتفظ بجميع الألقاب وأجزاء الاسم
   - تأكد من تشكيل الحروف بشكل صحيح (أ/إ/آ/ا)

4. **أمثلة على البيانات الصحيحة:**
   - "تحفة ظهران عبدالكريم عوض" -> "49704006070440"
   - "سعيرة شفيق أبو ضيف أحمد" -> "38708863098400"
   - "صابرين سيد أحمد محمد سليمان" -> "37088630984440"

**صيغة الإخراج (JSON فقط بدون أي نص إضافي):**
{
  "records": [
    {
      "name": "الاسم الكامل بالعربية كما هو مكتوب تماماً",
      "nationalId": "الرقم القومي بالأرقام الإنجليزية فقط"
    }
  ]
}

**قواعد صارمة:**
- استخرج جميع السجلات الموجودة في الصورة دون استثناء
- لا تترك أي سطر أو سجل
- الدقة مطلوبة 100% - راجع كل حرف ورقم مرتين
- إذا كانت الصورة غير واضحة لسجل معين، حاول قدر الإمكان قراءته بأفضل تخمين منطقي
- أرجع JSON فقط بدون أي تنسيق أو أكواد markdown`;

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

    // Convert to our schema format with data cleaning
    const records: ExtractedRecord[] = parsed.records.map((record: any, index: number) => ({
      id: `${fileName}-${Date.now()}-${index}`,
      name: (record.name || "").trim(),
      nationalId: cleanNationalId(record.nationalId || ""),
      sourceImageId: fileName,
    }));

    return records;
  } catch (error) {
    console.error("Error extracting data from image:", error);
    throw new Error(`فشل في معالجة الصورة: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
  }
}
