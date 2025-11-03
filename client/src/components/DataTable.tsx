import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export interface DataRow {
  id: string;
  name: string;
  nationalId: string;
}

interface DataTableProps {
  data: DataRow[];
  onEdit: (id: string, name: string, nationalId: string) => void;
  onDelete: (id: string) => void;
}

export default function DataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNationalId, setEditNationalId] = useState("");

  const startEdit = (row: DataRow) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditNationalId(row.nationalId);
  };

  const saveEdit = () => {
    if (editingId) {
      onEdit(editingId, editName, editNationalId);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (data.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-12">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-medium text-foreground">لا توجد بيانات</h3>
            <p className="text-base text-muted-foreground max-w-md mx-auto mt-2">
              قم برفع صورة للبدء في استخراج الأسماء والأرقام القومية
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="table-data">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                الاسم الكامل
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground w-48">
                الرقم القومي
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground w-24">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-border last:border-0 h-14 hover-elevate ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                }`}
                data-testid={`row-data-${row.id}`}
              >
                {editingId === row.id ? (
                  <>
                    <td className="px-6 py-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-base"
                        data-testid="input-edit-name"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <Input
                        value={editNationalId}
                        onChange={(e) => setEditNationalId(e.target.value)}
                        className="font-mono text-lg"
                        data-testid="input-edit-id"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={saveEdit}
                          data-testid="button-save"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          data-testid="button-cancel"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3 text-base text-foreground" data-testid={`text-name-${row.id}`}>
                      {row.name}
                    </td>
                    <td className="px-6 py-3 font-mono text-lg tracking-wide text-foreground" data-testid={`text-id-${row.id}`}>
                      {row.nationalId}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(row)}
                          data-testid={`button-edit-${row.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(row.id)}
                          data-testid={`button-delete-${row.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
