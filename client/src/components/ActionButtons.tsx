import { FileSpreadsheet, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCreateSheet: () => void;
  onDownloadExcel: () => void;
  onAddAnother: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onCreateSheet,
  onDownloadExcel,
  onAddAnother,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={onCreateSheet}
          disabled={disabled}
          className="flex-1"
          data-testid="button-create-sheet"
        >
          <FileSpreadsheet className="w-5 h-5 ml-2" />
          إنشاء ملف Google Sheets
        </Button>
        
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
