import UploadZone from '../UploadZone'

export default function UploadZoneExample() {
  const handleFilesSelect = (files: File[]) => {
    console.log('Files selected:', files.map(f => f.name));
  };

  return <UploadZone onFilesSelect={handleFilesSelect} maxFiles={40} />
}
