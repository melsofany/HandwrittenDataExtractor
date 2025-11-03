import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ImagePreview from "@/components/ImagePreview";
import ProcessingStatus from "@/components/ProcessingStatus";
import DataTable, { DataRow } from "@/components/DataTable";
import StatsCards from "@/components/StatsCards";
import ActionButtons from "@/components/ActionButtons";
import { useToast } from "@/hooks/use-toast";

type AppState = 'upload' | 'preview' | 'processing' | 'results';

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [data, setData] = useState<DataRow[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setState('preview');
    
    toast({
      title: "تم رفع الملف بنجاح",
      description: `الملف: ${file.name}`,
    });
  };

  const handleRemove = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setSelectedFile(null);
    setImageUrl("");
    setState('upload');
  };

  const handleReplace = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setSelectedFile(null);
    setImageUrl("");
    setState('upload');
  };

  const handleProcess = () => {
    setState('processing');
    setProgress(0);
    
    // Simulate processing steps
    const steps = [
      { step: "تحليل الصورة", progress: 33 },
      { step: "استخراج النصوص العربية", progress: 66 },
      { step: "تحديد الأسماء والأرقام القومية", progress: 100 },
    ];

    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex].step);
        setProgress(steps[currentStepIndex].progress);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        // Simulate extracted data
        const mockData: DataRow[] = [
          { id: '1', name: 'أحمد محمد علي حسن', nationalId: '29012011234567' },
          { id: '2', name: 'فاطمة حسن عبدالله محمود', nationalId: '28511981234568' },
          { id: '3', name: 'محمود سعيد إبراهيم أحمد', nationalId: '30105951234569' },
          { id: '4', name: 'نور الدين عمر خالد', nationalId: '29703001234570' },
          { id: '5', name: 'ليلى يوسف منصور', nationalId: '28209921234571' },
        ];
        setData(mockData);
        setState('results');
        
        toast({
          title: "تمت المعالجة بنجاح!",
          description: `تم استخراج ${mockData.length} سجلات`,
        });
      }
    }, 1500);
  };

  const handleEdit = (id: string, name: string, nationalId: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, name, nationalId } : item
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

  const handleCreateSheet = () => {
    toast({
      title: "جاري الإنشاء...",
      description: "سيتم إنشاء ملف Google Sheets جديد",
    });
    console.log('Creating Google Sheet with data:', data);
  };

  const handleDownloadExcel = () => {
    toast({
      title: "جاري التنزيل...",
      description: "سيتم تنزيل الملف قريباً",
    });
    console.log('Downloading Excel with data:', data);
  };

  const handleAddAnother = () => {
    handleRemove();
    setData([]);
  };

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} ميجابايت`;
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
                  قم برفع صورة الورقة المكتوبة بخط اليد
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  سنقوم باستخدام الذكاء الاصطناعي من Google Gemini لاستخراج الأسماء والأرقام القومية من الصورة وحفظها في Google Sheets
                </p>
              </div>
              <UploadZone onFileSelect={handleFileSelect} />
            </section>
          )}

          {state === 'preview' && selectedFile && (
            <section className="py-12 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  معاينة الصورة
                </h2>
                <p className="text-sm text-muted-foreground">
                  تأكد من وضوح الصورة قبل المعالجة
                </p>
              </div>
              
              <ImagePreview
                imageUrl={imageUrl}
                fileName={selectedFile.name}
                fileSize={formatFileSize(selectedFile.size)}
                dimensions="—"
                onRemove={handleRemove}
                onReplace={handleReplace}
              />
              
              <div className="flex justify-center">
                <ActionButtons
                  onCreateSheet={handleProcess}
                  onDownloadExcel={handleProcess}
                  onAddAnother={handleAddAnother}
                  disabled={false}
                />
              </div>
            </section>
          )}

          {state === 'processing' && (
            <section className="py-12 space-y-8">
              <ProcessingStatus
                status="processing"
                progress={progress}
                currentStep={currentStep}
                currentStepNumber={Math.floor(progress / 33) + 1}
                totalSteps={3}
              />
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
                errorRecords={0}
              />

              <DataTable
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <ActionButtons
                onCreateSheet={handleCreateSheet}
                onDownloadExcel={handleDownloadExcel}
                onAddAnother={handleAddAnother}
                disabled={data.length === 0}
              />
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
