
import React, { useState, useEffect } from 'react';
import DraggableInsights, { InsightDTO } from '@/components/DraggableInsights';
import InsightCard from '@/components/InsightCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [insights, setInsights] = useState<InsightDTO[]>([]);
  const [selectedVendorTabs, setSelectedVendorTabs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockInsights: InsightDTO[] = [
        {
          insightId: '1',
          insightPosition: 0,
          insightFilters: {
            vendors: [{ model_id: 'vendor1', name: 'Vendor 1' }]
          }
        },
        {
          insightId: '2',
          insightPosition: 1,
          insightFilters: {
            vendors: [{ model_id: 'vendor2', name: 'Vendor 2' }]
          }
        },
        {
          insightId: '3',
          insightPosition: 2,
          insightFilters: {
            vendors: [{ model_id: 'vendor3', name: 'Vendor 3' }]
          }
        },
        {
          insightId: '4',
          insightPosition: 3,
          insightFilters: {
            vendors: [{ model_id: 'vendor1', name: 'Vendor 1' }]
          }
        },
        {
          insightId: '5',
          insightPosition: 4,
          insightFilters: {
            vendors: [{ model_id: 'vendor2', name: 'Vendor 2' }]
          }
        }
      ];
      setInsights(mockInsights);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleReorderInsights = (reorderedInsights: InsightDTO[]) => {
    setInsights(reorderedInsights);
    
    // Here you would typically send the updated order to your backend
    console.log('New insights order:', reorderedInsights);
  };

  const getInsightView = (insight: InsightDTO) => {
    // Different card sizes based on insight ID (for demonstration)
    const size = parseInt(insight.insightId) % 3 === 0 
      ? 'h-64' 
      : parseInt(insight.insightId) % 2 === 0 
        ? 'h-96' 
        : 'h-72';

    return (
      <InsightCard insight={insight}>
        <div className={`${size} flex flex-col justify-between`}>
          <div>
            <h4 className="text-xl font-bold mb-2">Insight {insight.insightId}</h4>
            <p className="text-muted-foreground">
              This is a sample insight card with {size} height.
              Associated with vendors: {insight.insightFilters.vendors.map(v => v.name).join(', ')}
            </p>
          </div>
          <div className="mt-4">
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      </InsightCard>
    );
  };

  const getFilteredInsights = () => {
    if (selectedVendorTabs.length === 0) {
      return insights;
    } else {
      return insights.filter((insight: InsightDTO) => {
        const vendorIdsInInsight = insight.insightFilters.vendors.map(
          (vendor) => vendor.model_id
        );
        return vendorIdsInInsight.some(id => selectedVendorTabs.includes(id));
      });
    }
  };

  const vendors = [
    { id: 'vendor1', name: 'Vendor 1' },
    { id: 'vendor2', name: 'Vendor 2' },
    { id: 'vendor3', name: 'Vendor 3' },
  ];

  const toggleVendorFilter = (vendorId: string) => {
    setSelectedVendorTabs(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const saveInsightPositions = () => {
    // This would typically send the updated positions to your backend
    toast({
      title: "Changes saved",
      description: "Your insight positions have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Insights Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Drag and drop insights to reorder them. Cards can be different sizes.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {vendors.map((vendor) => (
                <Button
                  key={vendor.id}
                  variant={selectedVendorTabs.includes(vendor.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVendorFilter(vendor.id)}
                >
                  {vendor.name}
                </Button>
              ))}
            </div>
            <Button onClick={saveInsightPositions}>Save Positions</Button>
          </div>
        </header>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Loading insights...</p>
          </div>
        ) : (
          <DraggableInsights 
            insights={getFilteredInsights()} 
            renderInsight={getInsightView}
            onReorder={handleReorderInsights}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
