import { useState } from 'react';
import ImageGallery, { ImageFile } from '../ImageGallery'

export default function ImageGalleryExample() {
  const [images, setImages] = useState<ImageFile[]>([
    {
      id: '1',
      file: new File([''], 'وثيقة_1.jpg', { type: 'image/jpeg' }),
      url: 'https://via.placeholder.com/400/e5e7eb/6b7280?text=1',
      status: 'completed'
    },
    {
      id: '2',
      file: new File([''], 'وثيقة_2.jpg', { type: 'image/jpeg' }),
      url: 'https://via.placeholder.com/400/e5e7eb/6b7280?text=2',
      status: 'processing'
    },
    {
      id: '3',
      file: new File([''], 'وثيقة_3.jpg', { type: 'image/jpeg' }),
      url: 'https://via.placeholder.com/400/e5e7eb/6b7280?text=3',
      status: 'pending'
    },
  ]);

  const handleRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    console.log('Removed image:', id);
  };

  const handleRemoveAll = () => {
    setImages([]);
    console.log('Removed all images');
  };

  return <ImageGallery images={images} onRemove={handleRemove} onRemoveAll={handleRemoveAll} />
}
