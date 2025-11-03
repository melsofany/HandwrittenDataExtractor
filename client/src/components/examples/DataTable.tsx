import { useState } from 'react';
import DataTable, { DataRow } from '../DataTable'

export default function DataTableExample() {
  const [data, setData] = useState<DataRow[]>([
    { id: '1', name: 'أحمد محمد علي', nationalId: '29012011234567' },
    { id: '2', name: 'فاطمة حسن عبدالله', nationalId: '28511981234568' },
    { id: '3', name: 'محمود سعيد إبراهيم', nationalId: '30105951234569' },
  ]);

  const handleEdit = (id: string, name: string, nationalId: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, name, nationalId } : item
    ));
    console.log('Edited:', { id, name, nationalId });
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    console.log('Deleted:', id);
  };

  return <DataTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
}
