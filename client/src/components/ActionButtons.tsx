import { useState } from "react";
import { FileSpreadsheet, Download, Plus, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ActionButtonsProps {
  onCreateSheet: () => void;
  onAppendToSheet?: (spreadsheetUrl: string) => void;
  onDownloadExcel: () => void;
  onAddAnother: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onCreateSheet,
  onAppendToSheet,
  onDownloadExcel,
  onAddAnother,
  disabled = false,
}: ActionButtonsProps) {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("https://docs.google.com/spreadsheets/d/11KUG_ST6mzm22PfLXgqARJkR7QhR-icwphVsNdYexJM/edit");
  const [showAppendInput, setShowAppendInput] = useState(true);

  const handleAppendClick = () => {
    if (spreadsheetUrl.trim() && onAppendToSheet) {
      onAppendToSheet(spreadsheetUrl.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">حفظ إلى Google Sheets</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={onCreateSheet}
              disabled={disabled}
              className="flex-1"
              data-testid="button-create-sheet"
            >
              <FileSpreadsheet className="w-5 h-5 ml-2" />
              إنشاء ملف جديد
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowAppendInput(!showAppendInput)}
              disabled={disabled}
              className="flex-1"
              data-testid="button-toggle-append"
            >
              <FilePlus className="w-5 h-5 ml-2" />
              إضافة لملف موجود
            </Button>
          </div>

          {showAppendInput && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="spreadsheet-url" className="text-foreground">
                  رابط ملف Google Sheets
                </Label>
                <Input
                  id="spreadsheet-url"
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  dir="ltr"
                  className="text-left"
                  data-testid="input-spreadsheet-url"
                />
              </div>
              <Button
                size="lg"
                onClick={handleAppendClick}
                disabled={disabled || !spreadsheetUrl.trim()}
                className="w-full"
                data-testid="button-append-to-sheet"
              >
                <FilePlus className="w-5 h-5 ml-2" />
                إضافة البيانات إلى الملف
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={onDownloadExcel}
          disabled={disabled}
          className="flex-1"
          data-testid="button-download-excel"
        >
          <Download className="w-5 h-5 ml-2" />
          تنزيل كملف Excel
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onAddAnother}
          data-testid="button-add-another"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة صورة أخرى
        </Button>
      </div>
    </div>
  );
}
