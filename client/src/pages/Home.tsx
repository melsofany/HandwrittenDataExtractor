import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ImageGallery, { ImageFile } from "@/components/ImageGallery";
import BatchProcessingStatus from "@/components/BatchProcessingStatus";
import DataTable, { DataRow } from "@/components/DataTable";
import StatsCards from "@/components/StatsCards";
import ActionButtons from "@/components/ActionButtons";
import SheetSuccessCard from "@/components/SheetSuccessCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Play, Pencil } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type AppState = 'upload' | 'preview' | 'processing' | 'edit' | 'results' | 'sheet-created';

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState(0);
  const [successfulImages, setSuccessfulImages] = useState(0);
  const [errorImages, setErrorImages] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [data, setData] = useState<DataRow[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelect = (files: File[]) => {
    const newImages: ImageFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setImages(prev => [...prev, ...newImages].slice(0, 40));
    setState('preview');
    
    toast({
      title: "تم رفع الصور بنجاح",
      description: `تم إضافة ${files.length} صورة`,
    });
  };

  const handleRemoveImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    setImages(prev => prev.filter(img => img.id !== id));
    
    if (images.length === 1) {
      setState('upload');
    }
  };

  const handleRemoveAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setState('upload');
  };

  const handleProcess = async () => {
    setState('processing');
    setIsProcessing(true);
    setProcessedImages(0);
    setSuccessfulImages(0);
    setErrorImages(0);
    
    const allData: DataRow[] = [];
    
    try {
      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        setCurrentImage(image.file.name);
        
        // Update image status to processing
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'processing' as const } : img
        ));
        
        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('image', image.file);
          
          // Send to API with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 480000); // 8 minutes timeout
          
          const response = await fetch('/api/process-image', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`خطأ في الخادم: ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.success && result.records) {
            // Add records to our data
            allData.push(...result.records);
            
            setImages(prev => prev.map(img => 
              img.id === image.id ? { ...img, status: 'completed' as const } : img
            ));
            setSuccessfulImages(prev => prev + 1);
          } else {
            throw new Error(result.error || 'فشل في معالجة الصورة');
          }
        } catch (error) {
          console.error(`Error processing ${image.file.name}:`, error);
          setImages(prev => prev.map(img => 
            img.id === image.id ? { ...img, status: 'error' as const } : img
          ));
          setErrorImages(prev => prev + 1);
          
          // If server disconnected, show specific error
          if (error instanceof TypeError && error.message.includes('fetch')) {
            toast({
              title: "فقدان الاتصال",
              description: "حدث انقطاع في الاتصال بالخادم. جاري المتابعة...",
              variant: "destructive",
            });
          }
        }
        
        setProcessedImages(prev => prev + 1);
      }
      
      setData(allData);
      setState('edit');
      
      toast({
        title: "اكتملت المعالجة!",
        description: `تم استخراج ${allData.length} سجل. يرجى مراجعة البيانات للتأكد من دقتها`,
      });
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast({
        title: "خطأ في المعالجة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      setState('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  const normalizeArabicNumbers = (text: string): string => {
    const arabicToEnglish: { [key: string]: string } = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return text.replace(/[٠-٩]/g, (match) => arabicToEnglish[match] || match);
  };

  const cleanNationalId = (nationalId: string): string => {
    let cleaned = normalizeArabicNumbers(nationalId);
    cleaned = cleaned.replace(/[^\d]/g, '');
    return cleaned;
  };

  const handleEdit = (id: string, name: string, nationalId: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, name: name.trim(), nationalId: cleanNationalId(nationalId) } : item
    ));
    
    toast({
      title: "تم التعديل",
      description: "تم تحديث البيانات بنجاح",
    });
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف السجل بنجاح",
      variant: "destructive",
    });
  };

  const handleCreateSheet = async () => {
    try {
      toast({
        title: "جاري الإنشاء...",
        description: "يرجى الانتظار، جاري إنشاء ملف Google Sheets",
      });

      const response = await fetch('/api/create-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: data,
          sheetName: `بيانات مستخرجة - ${new Date().toLocaleDateString('ar-EG')}`,
        }),
      });

      const result = await response.json();

      if (result.success && result.sheetUrl) {
        setSheetUrl(result.sheetUrl);
        setState('sheet-created');
        
        toast({
          title: "تم الإنشاء بنجاح!",
          description: "تم إنشاء ملف Google Sheets وحفظ البيانات",
        });
      } else {
        throw new Error(result.error || 'فشل في إنشاء Google Sheet');
      }
    } catch (error) {
      console.error("Error creating sheet:", error);
      toast({
        title: "خطأ في الإنشاء",
        description: error instanceof Error ? error.message : "فشل في إنشاء Google Sheet",
        variant: "destructive",
      });
    }
  };

  const handleAppendToSheet = async (spreadsheetUrl: string) => {
    try {
      toast({
        title: "جاري الإضافة...",
        description: "يرجى الانتظار، جاري إضافة البيانات إلى الملف",
      });

      const response = await fetch('/api/append-to-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: data,
          spreadsheetUrl,
        }),
      });

      const result = await response.json();

      if (result.success && result.sheetUrl) {
        setSheetUrl(result.sheetUrl);
        setState('sheet-created');
        
        toast({
          title: "تم الإضافة بنجاح!",
          description: `تم إضافة ${data.length} سجل إلى الملف`,
        });
      } else {
        throw new Error(result.error || 'فشل في الإضافة إلى Google Sheet');
      }
    } catch (error) {
      console.error("Error appending to sheet:", error);
      toast({
        title: "خطأ في الإضافة",
        description: error instanceof Error ? error.message : "فشل في الإضافة إلى Google Sheet",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = () => {
    toast({
      title: "قريباً",
      description: "ميزة التنزيل كـ Excel ستكون متاحة قريباً",
    });
  };

  const handleAddAnother = () => {
    if (images.length < 40) {
      setState('upload');
    } else {
      toast({
        title: "تنبيه",
        description: "لقد وصلت للحد الأقصى من الصور (40 صورة)",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    handleRemoveAll();
    setData([]);
    setSheetUrl("");
    setState('upload');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6">
          {state === 'upload' && (
            <section className="py-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  قم برفع صور الأوراق المكتوبة بخط اليد
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  سنقوم باستخدام الذكاء الاصطناعي من Google Gemini لاستخراج الأسماء والأرقام القومية من الصور وحفظها في Google Sheets
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  يمكنك رفع حتى 40 صورة في المرة الواحدة
                </p>
              </div>
              <UploadZone onFilesSelect={handleFilesSelect} maxFiles={40} />
            </section>
          )}

          {state === 'preview' && images.length > 0 && (
            <section className="py-12 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  معاينة الصور ({images.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  تأكد من وضوح جميع الصور قبل بدء المعالجة
                </p>
              </div>
              
              <ImageGallery
                images={images}
                onRemove={handleRemoveImage}
                onRemoveAll={handleRemoveAll}
              />
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="min-w-64"
                  data-testid="button-start-processing"
                >
                  <Play className="w-5 h-5 ml-2" />
                  بدء معالجة {images.length} صورة
                </Button>
                
                {images.length < 40 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setState('upload')}
                    data-testid="button-add-more"
                  >
                    إضافة المزيد من الصور ({40 - images.length} متبقية)
                  </Button>
                )}
              </div>
            </section>
          )}

          {state === 'processing' && (
            <section className="py-12 space-y-8">
              <ImageGallery
                images={images}
                onRemove={() => {}}
                onRemoveAll={() => {}}
              />
              
              <BatchProcessingStatus
                totalImages={images.length}
                processedImages={processedImages}
                successfulImages={successfulImages}
                errorImages={errorImages}
                currentImage={currentImage}
              />
            </section>
          )}

          {state === 'edit' && (
            <section className="py-12 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                  <Pencil className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  مراجعة وتحرير البيانات
                </h2>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  تم استخراج <span className="font-bold text-primary">{data.length}</span> سجل من الصور.
                  <br />
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    يرجى مراجعة البيانات بعناية والتأكد من دقتها قبل التصدير.
                  </span>
                  <br />
                  انقر على أيقونة القلم لتعديل أي سجل، أو أيقونة سلة المهملات لحذفه.
                </p>
              </div>

              <StatsCards
                totalRecords={data.length}
                successfulRecords={data.length}
                errorRecords={errorImages}
              />

              <DataTable
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setState('results')}
                  className="min-w-64"
                  data-testid="button-confirm-data"
                >
                  تأكيد البيانات والمتابعة
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setState('preview')}
                  data-testid="button-back-to-images"
                >
                  العودة للصور
                </Button>
              </div>
            </section>
          )}

          {state === 'results' && (
            <section className="py-12 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  نتائج الاستخراج
                </h2>
                <p className="text-sm text-muted-foreground">
                  يمكنك تعديل البيانات قبل الحفظ في Google Sheets
                </p>
              </div>

              <StatsCards
                totalRecords={data.length}
                successfulRecords={data.length}
                errorRecords={errorImages}
              />

              <DataTable
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <ActionButtons
                onCreateSheet={handleCreateSheet}
                onAppendToSheet={handleAppendToSheet}
                onDownloadExcel={handleDownloadExcel}
                onAddAnother={handleReset}
                disabled={data.length === 0}
              />
            </section>
          )}

          {state === 'sheet-created' && (
            <section className="py-12 space-y-8">
              <SheetSuccessCard
                sheetUrl={sheetUrl}
                recordCount={data.length}
              />
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  data-testid="button-start-new"
                >
                  بدء عملية جديدة
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                الخصوصية
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                الشروط
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                الدعم
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 معالج الخط اليدوي العربي
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
