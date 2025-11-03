import ImagePreview from '../ImagePreview'

export default function ImagePreviewExample() {
  const handleRemove = () => {
    console.log('Remove clicked');
  };

  const handleReplace = () => {
    console.log('Replace clicked');
  };

  return (
    <ImagePreview
      imageUrl="https://via.placeholder.com/800x600/e5e7eb/6b7280?text=صورة+عربية"
      fileName="وثيقة_عربية.jpg"
      fileSize="2.4 ميجابايت"
      dimensions="1920 × 1080 بكسل"
      onRemove={handleRemove}
      onReplace={handleReplace}
    />
  );
}
