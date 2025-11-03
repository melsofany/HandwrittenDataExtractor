import ProcessingStatus from '../ProcessingStatus'

export default function ProcessingStatusExample() {
  return (
    <div className="space-y-4">
      <ProcessingStatus
        status="processing"
        progress={65}
        currentStep="تحليل الصورة واستخراج النصوص"
        currentStepNumber={2}
        totalSteps={3}
      />
    </div>
  );
}
