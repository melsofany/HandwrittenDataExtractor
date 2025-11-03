import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ProcessingStatusProps {
  status: 'processing' | 'success' | 'error';
  progress: number;
  currentStep: string;
  totalSteps?: number;
  currentStepNumber?: number;
}

export default function ProcessingStatus({
  status,
  progress,
  currentStep,
  totalSteps = 3,
  currentStepNumber = 1,
}: ProcessingStatusProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === 'processing' && (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-6 h-6 text-destructive" />
            )}
            
            <div>
              <h3 className="text-lg font-medium text-foreground" data-testid="text-status">
                {status === 'processing' && 'جاري المعالجة...'}
                {status === 'success' && 'تمت المعالجة بنجاح'}
                {status === 'error' && 'حدث خطأ في المعالجة'}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-step">
                {currentStepNumber} من {totalSteps}: {currentStep}
              </p>
            </div>
          </div>
          
          <span className="text-2xl font-bold text-primary" data-testid="text-progress">
            {progress}%
          </span>
        </div>

        <Progress value={progress} className="h-3" data-testid="progress-bar" />

        {status === 'processing' && (
          <p className="text-sm text-muted-foreground text-center">
            يرجى الانتظار، قد تستغرق هذه العملية بضع ثوانٍ...
          </p>
        )}
      </div>
    </Card>
  );
}
