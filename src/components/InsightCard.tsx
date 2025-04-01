
import React from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { InsightDTO } from './DraggableInsights';
import { Button } from '@/components/ui/button';

interface InsightCardProps {
  insight: InsightDTO;
  children: React.ReactNode;
  dragHandleProps?: any;
  onToggleVisibility?: (insightId: string) => void;
  isVisible?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  insight, 
  children, 
  dragHandleProps,
  onToggleVisibility,
  isVisible = true
}) => {
  return (
    <Card className={`overflow-hidden h-full bg-card transition-opacity duration-200 ${!isVisible ? 'opacity-60' : ''}`}>
      <div className="flex items-center p-2 bg-muted/50 border-b">
        <div className="flex-1 flex items-center">
          <div {...dragHandleProps}>
            <GripVertical className="h-5 w-5 text-muted-foreground mr-2 cursor-move" />
          </div>
          <h3 className="font-medium text-sm">Insight #{insight.insightPosition + 1}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggleVisibility?.(insight.insightId)}
          title={isVisible ? "Hide insight" : "Show insight"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </Card>
  );
};

export default InsightCard;
