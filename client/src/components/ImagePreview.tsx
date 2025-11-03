import { X, RotateCw, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  fileSize: string;
  dimensions?: string;
  onRemove: () => void;
  onReplace: () => void;
}

export default function ImagePreview({
  imageUrl,
  fileName,
  fileSize,
  dimensions,
  onRemove,
  onReplace,
}: ImagePreviewProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center bg-muted/30 rounded-xl p-4">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-96 w-auto object-contain rounded-md"
            data-testid="img-preview"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-foreground truncate" data-testid="text-filename">
                  {fileName}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                  {fileSize}
                </p>
                {dimensions && (
                  <p className="text-sm text-muted-foreground" data-testid="text-dimensions">
                    {dimensions}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">معلومات الملف</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النوع:</span>
                  <span className="text-foreground font-medium">صورة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الحالة:</span>
                  <span className="text-foreground font-medium">جاهز للمعالجة</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onReplace}
              className="flex-1"
              data-testid="button-replace"
            >
              <RotateCw className="w-4 h-4 ml-2" />
              استبدال
            </Button>
            <Button
              variant="destructive"
              onClick={onRemove}
              className="flex-1"
              data-testid="button-remove"
            >
              <X className="w-4 h-4 ml-2" />
              إزالة
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
