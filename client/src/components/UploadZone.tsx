import { useState, useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
}

export default function UploadZone({ onFilesSelect, maxFiles = 40 }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/')).slice(0, maxFiles);
    
    if (imageFiles.length > 0) {
      onFilesSelect(imageFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, maxFiles);
      if (imageFiles.length > 0) {
        onFilesSelect(imageFiles);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`min-h-80 border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover-elevate ${
          isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border'
        }`}
        data-testid="upload-zone"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            اسحب الصور هنا أو انقر للاختيار
          </h3>
          <p className="text-sm text-muted-foreground">
            يدعم JPG, PNG - حد أقصى {maxFiles} صورة
          </p>
          <p className="text-xs text-muted-foreground">
            حجم الملف الواحد: حد أقصى 10 ميجابايت
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileInput}
          className="hidden"
          multiple
          data-testid="input-file"
        />
      </div>

      <div className="mt-4 text-center">
        <Button 
          variant="secondary" 
          size="lg"
          onClick={handleClick}
          data-testid="button-choose-file"
        >
          <ImageIcon className="w-5 h-5 ml-2" />
          اختر صور متعددة
        </Button>
      </div>
    </div>
  );
}
