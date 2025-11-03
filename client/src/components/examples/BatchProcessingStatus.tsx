import BatchProcessingStatus from '../BatchProcessingStatus'

export default function BatchProcessingStatusExample() {
  return (
    <BatchProcessingStatus
      totalImages={40}
      processedImages={25}
      successfulImages={23}
      errorImages={2}
      currentImage="وثيقة_26.jpg"
    />
  );
}
