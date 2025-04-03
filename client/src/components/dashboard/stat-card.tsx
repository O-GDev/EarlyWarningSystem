import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgClass: string;
  changeValue?: number;
  changeText?: string;
  isLoading?: boolean;
  isChangeNegative?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgClass,
  changeValue,
  changeText,
  isLoading = false,
  isChangeNegative
}: StatCardProps) {
  // If isChangeNegative is explicitly provided, use it, otherwise determine it from the changeValue
  const isPositiveChange = isChangeNegative !== undefined 
    ? !isChangeNegative 
    : (changeValue !== undefined && changeValue >= 0);
  
  return (
    <Card className={cn("bg-white rounded-lg shadow-sm p-5", isLoading && "animate-pulse")}>
      <div className="flex justify-between">
        <div>
          <p className="text-neutral-500 text-sm">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-neutral-200 rounded mt-1"></div>
          ) : (
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          )}
        </div>
        <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg", iconBgClass)}>
          {icon}
        </div>
      </div>
      {(changeValue !== undefined || changeText) && (
        <div className="flex items-center mt-3 text-xs">
          {isLoading ? (
            <div className="h-4 w-16 bg-neutral-200 rounded"></div>
          ) : (
            <>
              <span className={cn(
                "flex items-center",
                isPositiveChange ? "text-success" : "text-danger"
              )}>
                {isPositiveChange ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(changeValue || 0)}%
              </span>
              <span className="text-neutral-500 ml-2">{changeText}</span>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
