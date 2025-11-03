import { X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ImageFile {
  id: string;
  file: File;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ImageGalleryProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
}

export default function ImageGallery({ images, onRemove, onRemoveAll }: ImageGalleryProps) {
  const formatFileSize = (bytes: number): string => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
  };

  const getStatusBadge = (status: ImageFile['status']) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', className: 'bg-muted text-muted-foreground' },
      processing: { label: 'قيد المعالجة', className: 'bg-primary text-primary-foreground' },
      completed: { label: 'مكتمل', className: 'bg-green-600 text-white dark:bg-green-700' },
      error: { label: 'خطأ', className: 'bg-destructive text-destructive-foreground' },
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            الصور المرفوعة ({images.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            يمكنك رفع حتى 40 صورة في المرة الواحدة
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemoveAll}
          data-testid="button-remove-all"
        >
          <X className="w-4 h-4 ml-2" />
          إزالة الكل
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group rounded-lg overflow-hidden border border-border hover-elevate"
            data-testid={`image-card-${image.id}`}
          >
            <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
              <img
                src={image.url}
                alt={image.file.name}
                className="w-full h-full object-cover"
                data-testid={`img-${image.id}`}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
                {getStatusBadge(image.status)}
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7 opacity-90"
                  onClick={() => onRemove(image.id)}
                  data-testid={`button-remove-${image.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                <p className="text-xs font-medium truncate" title={image.file.name}>
                  {image.file.name}
                </p>
                <p className="text-xs opacity-90">
                  {formatFileSize(image.file.size)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
