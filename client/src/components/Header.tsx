import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">معالج الخط اليدوي</h1>
            <p className="text-xs text-muted-foreground">تحويل الأوراق إلى Google Sheets</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" data-testid="button-help">
          مساعدة
        </Button>
      </div>
    </header>
  );
}
