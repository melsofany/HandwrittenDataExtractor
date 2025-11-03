import ActionButtons from '../ActionButtons'

export default function ActionButtonsExample() {
  const handleCreateSheet = () => {
    console.log('Create Google Sheet clicked');
  };

  const handleDownloadExcel = () => {
    console.log('Download Excel clicked');
  };

  const handleAddAnother = () => {
    console.log('Add another image clicked');
  };

  return (
    <ActionButtons
      onCreateSheet={handleCreateSheet}
      onDownloadExcel={handleDownloadExcel}
      onAddAnother={handleAddAnother}
      disabled={false}
    />
  );
}
