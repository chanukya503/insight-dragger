
import React from 'react';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { InsightDTO } from './DraggableInsights';

interface InsightCardProps {
  insight: InsightDTO;
  children: React.ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, children }) => {
  return (
    <Card className="overflow-hidden h-full bg-card">
      <div className="flex items-center p-2 bg-muted/50 border-b">
        <div className="flex-1 flex items-center">
          <GripVertical className="h-5 w-5 text-muted-foreground mr-2 cursor-move" />
          <h3 className="font-medium text-sm">Insight #{insight.insightPosition + 1}</h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </Card>
  );
};

export default InsightCard;
