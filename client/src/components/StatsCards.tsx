import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  totalRecords: number;
  successfulRecords: number;
  errorRecords: number;
}

export default function StatsCards({
  totalRecords,
  successfulRecords,
  errorRecords,
}: StatsCardsProps) {
  const stats = [
    {
      label: "إجمالي السجلات",
      value: totalRecords,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      testId: "stat-total"
    },
    {
      label: "سجلات ناجحة",
      value: successfulRecords,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      testId: "stat-success"
    },
    {
      label: "سجلات بها أخطاء",
      value: errorRecords,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      testId: "stat-errors"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6" data-testid={stat.testId}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-4xl font-bold text-foreground" data-testid={`${stat.testId}-value`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
