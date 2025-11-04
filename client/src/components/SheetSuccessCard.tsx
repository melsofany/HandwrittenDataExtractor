import { CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SheetSuccessCardProps {
  sheetUrl: string;
  recordCount: number;
}

export default function SheetSuccessCard({ sheetUrl, recordCount }: SheetSuccessCardProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sheetUrl);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ رابط Google Sheet",
    });
  };

  const handleOpenSheet = () => {
    window.open(sheetUrl, '_blank');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-600 dark:bg-green-700 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            تم إنشاء Google Sheet بنجاح!
          </h2>
          <p className="text-base text-muted-foreground">
            تم حفظ {recordCount} سجل في الملف
          </p>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">رابط الملف:</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="flex-1 p-3 bg-muted/50 rounded-md text-sm font-mono text-foreground truncate"
              data-testid="text-sheet-url"
            >
              {sheetUrl}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopyLink}
              data-testid="button-copy-link"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={handleOpenSheet}
            data-testid="button-open-sheet"
          >
            <ExternalLink className="w-5 h-5 ml-2" />
            فتح Google Sheet
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyLink}
            data-testid="button-copy"
          >
            <Copy className="w-5 h-5 ml-2" />
            نسخ الرابط
          </Button>
        </div>
      </div>
    </Card>
  );
}
