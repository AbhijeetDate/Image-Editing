
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Sun,
  Contrast,
  PaintBucket,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Crop,
  SlidersHorizontal
} from 'lucide-react';

interface FilterOption {
  name: string;
  label: string;
  preview?: string;
}

interface AdjustmentOption {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  icon: React.ReactNode;
}

interface EditorSidebarProps {
  hasImage: boolean;
  filters: FilterOption[];
  onFilterChange: (filterName: string) => void;
  adjustments: AdjustmentOption[];
  onAdjustmentChange: (name: string, value: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onDownload: () => void;
  className?: string;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  hasImage,
  filters,
  onFilterChange,
  adjustments,
  onAdjustmentChange,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  onDownload,
  className
}) => {
  const handleSliderChange = (name: string, values: number[]) => {
    onAdjustmentChange(name, values[0]);
  };
  
  const colorFilters = filters.filter(f => !['bw', 'binary', 'amber', 'gold', 'rosegold', 'neutral', 'coolrose'].includes(f.name));
  const monochromeFilters = filters.filter(f => ['bw', 'binary', 'amber', 'gold', 'rosegold', 'neutral', 'coolrose'].includes(f.name));

  return (
    <div className={cn('glass-panel flex flex-col p-4 w-full max-w-xs h-full', className)}>
      <h2 className="font-medium text-xl text-white mb-4">Editor Tools</h2>

      {!hasImage ? (
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <p className="text-gray-400">Upload an image to start editing</p>
        </div>
      ) : (
        <Tabs defaultValue="filters" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
          </TabsList>
          
          <TabsContent value="filters" className="flex-1 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-white">Color Filters</h3>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={cn(
                    "aspect-square rounded-md filter-preview flex items-center justify-center bg-gray-700 text-sm overflow-hidden",
                    "border-2 border-editor-accent"
                  )}
                  onClick={() => onFilterChange('none')}
                >
                  <span className="text-white">Original</span>
                </div>
                {colorFilters.map((filter) => (
                  <div
                    key={filter.name}
                    className="aspect-square rounded-md filter-preview overflow-hidden bg-gray-700"
                    onClick={() => onFilterChange(filter.name)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs text-center px-1">{filter.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-white">Monochrome</h3>
              <div className="grid grid-cols-3 gap-2">
                {monochromeFilters.map((filter) => (
                  <div
                    key={filter.name}
                    className="aspect-square rounded-md filter-preview overflow-hidden bg-gray-700"
                    onClick={() => onFilterChange(filter.name)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs text-center px-1">{filter.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="adjust" className="flex-1 overflow-y-auto space-y-4">
            {adjustments.map((adjustment) => (
              <div key={adjustment.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {adjustment.icon}
                    <label className="text-sm text-gray-200">
                      {adjustment.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-400">
                    {adjustment.value}
                  </span>
                </div>
                <Slider
                  value={[adjustment.value]}
                  min={adjustment.min}
                  max={adjustment.max}
                  step={adjustment.step}
                  onValueChange={(values) => handleSliderChange(adjustment.name, values)}
                  className="slider-track"
                  thumbClassName="slider-thumb"
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="transform" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-medium text-white">Rotate</h3>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gray-800 hover:bg-gray-700"
                  variant="secondary" 
                  onClick={onRotateLeft}
                >
                  <RotateCcw size={18} className="mr-2" />
                  Left
                </Button>
                <Button 
                  className="flex-1 bg-gray-800 hover:bg-gray-700"
                  variant="secondary" 
                  onClick={onRotateRight}
                >
                  <RotateCw size={18} className="mr-2" />
                  Right
                </Button>
              </div>
              
              <h3 className="font-medium text-white mt-4">Flip</h3>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gray-800 hover:bg-gray-700"
                  variant="secondary" 
                  onClick={onFlipHorizontal}
                >
                  <FlipHorizontal size={18} className="mr-2" />
                  Horizontal
                </Button>
                <Button 
                  className="flex-1 bg-gray-800 hover:bg-gray-700"
                  variant="secondary" 
                  onClick={onFlipVertical}
                >
                  <FlipVertical size={18} className="mr-2" />
                  Vertical
                </Button>
              </div>
              
              <h3 className="font-medium text-white mt-4">Crop</h3>
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-700"
                variant="secondary"
                disabled
              >
                <Crop size={18} className="mr-2" />
                Coming soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {hasImage && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Button 
            className="w-full bg-editor-accent hover:bg-editor-accent-hover"
            onClick={onDownload}
          >
            <Download size={18} className="mr-2" />
            Download Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
