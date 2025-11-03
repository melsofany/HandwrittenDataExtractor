import { Loader2, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface BatchProcessingStatusProps {
  totalImages: number;
  processedImages: number;
  successfulImages: number;
  errorImages: number;
  currentImage?: string;
}

export default function BatchProcessingStatus({
  totalImages,
  processedImages,
  successfulImages,
  errorImages,
  currentImage,
}: BatchProcessingStatusProps) {
  const progress = totalImages > 0 ? Math.round((processedImages / totalImages) * 100) : 0;
  const isComplete = processedImages === totalImages;
  const hasErrors = errorImages > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {!isComplete && (
              <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0 mt-1" />
            )}
            {isComplete && !hasErrors && (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            )}
            {isComplete && hasErrors && (
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground" data-testid="text-status">
                {!isComplete && 'جاري معالجة الصور...'}
                {isComplete && !hasErrors && 'تمت معالجة جميع الصور بنجاح!'}
                {isComplete && hasErrors && 'اكتملت المعالجة مع بعض الأخطاء'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {processedImages} من {totalImages} صورة
              </p>
              {currentImage && !isComplete && (
                <p className="text-sm text-muted-foreground mt-1" data-testid="text-current">
                  الصورة الحالية: {currentImage}
                </p>
              )}
            </div>
          </div>
          
          <span className="text-3xl font-bold text-primary" data-testid="text-progress">
            {progress}%
          </span>
        </div>

        <Progress value={progress} className="h-3" data-testid="progress-bar" />

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalImages}</p>
              <p className="text-xs text-muted-foreground">إجمالي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-foreground">{successfulImages}</p>
              <p className="text-xs text-muted-foreground">ناجحة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">{errorImages}</p>
              <p className="text-xs text-muted-foreground">أخطاء</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
