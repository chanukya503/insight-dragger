
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from '@/components/ui/use-toast';

export interface InsightDTO {
  insightId: string;
  insightPosition: number;
  insightFilters: {
    vendors: {
      model_id: string;
      name: string;
    }[];
  };
  // Add other fields as needed
}

interface DraggableInsightsProps {
  insights: InsightDTO[];
  renderInsight: (insight: InsightDTO, dragHandleProps?: any, isVisible?: boolean, onToggleVisibility?: (insightId: string) => void) => React.ReactNode;
  onReorder?: (reorderedInsights: InsightDTO[]) => void;
}

const DraggableInsights: React.FC<DraggableInsightsProps> = ({ 
  insights, 
  renderInsight,
  onReorder
}) => {
  const [items, setItems] = useState<InsightDTO[]>([]);
  const [hiddenInsights, setHiddenInsights] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize the items when insights change
    setItems(insights);
  }, [insights]);

  const handleToggleVisibility = (insightId: string) => {
    setHiddenInsights(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(insightId)) {
        newHidden.delete(insightId);
        toast({
          title: "Insight visible",
          description: "The insight is now visible on your dashboard.",
          duration: 2000,
        });
      } else {
        newHidden.add(insightId);
        toast({
          title: "Insight hidden",
          description: "The insight is now hidden from your dashboard view.",
          duration: 2000,
        });
      }
      return newHidden;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // If the item was dropped in the same position, do nothing
    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedItems = reorderInsights(
      items,
      result.source.index,
      result.destination.index
    );

    // Update state with the new order
    setItems(reorderedItems);

    // Call callback if provided
    if (onReorder) {
      onReorder(reorderedItems);
    }

    toast({
      title: "Insights reordered",
      description: "The order of your insights has been updated.",
      duration: 2000,
    });
  };

  // Helper function to reorder the insights array
  const reorderInsights = (
    list: InsightDTO[],
    startIndex: number,
    endIndex: number
  ): InsightDTO[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update the insightPosition values
    return result.map((item, index) => ({
      ...item,
      insightPosition: index
    }));
  };

  // Function to get grid styles
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="insights-droppable" type="INSIGHT">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
          >
            {items.map((insight, index) => (
              <Draggable 
                key={insight.insightId} 
                draggableId={insight.insightId} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging ? 'shadow-lg ring-2 ring-primary rounded-lg z-50 opacity-90' : ''
                    }`}
                  >
                    {renderInsight(
                      insight, 
                      provided.dragHandleProps, 
                      !hiddenInsights.has(insight.insightId),
                      handleToggleVisibility
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableInsights;
