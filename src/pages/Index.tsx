
import React, { useState, useRef } from 'react';
import { Sun, Contrast, PaintBucket, Sparkles, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import ImageUploader from '@/components/ImageUploader';
import EditorSidebar from '@/components/EditorSidebar';
import ImageEditor from '@/components/ImageEditor';

const Index = () => {
  const [image, setImage] = useState<File | null>(null);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    highlights: 0,
    shadows: 0,
  });
  const [transformation, setTransformation] = useState({
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleImageSelected = (file: File) => {
    setImage(file);
    // Reset filters and adjustments when a new image is selected
    setCurrentFilter('none');
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      highlights: 0,
      shadows: 0,
    });
    setTransformation({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    });
  };

  const handleFilterChange = (filterName: string) => {
    setCurrentFilter(filterName);
  };

  const handleAdjustmentChange = (name: string, value: number) => {
    setAdjustments(prev => ({ ...prev, [name]: value }));
  };

  const handleRotateLeft = () => {
    setTransformation(prev => ({
      ...prev,
      rotation: (prev.rotation - 90) % 360,
    }));
  };

  const handleRotateRight = () => {
    setTransformation(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleFlipHorizontal = () => {
    setTransformation(prev => ({
      ...prev,
      flipHorizontal: !prev.flipHorizontal,
    }));
  };

  const handleFlipVertical = () => {
    setTransformation(prev => ({
      ...prev,
      flipVertical: !prev.flipVertical,
    }));
  };

  const handleDownload = () => {
    // In a real application, this would make an API call to process the image server-side
    // For this demo, we'll just save the current canvas content
    
    try {
      if (editorRef.current) {
        const canvas = editorRef.current.querySelector('canvas');
        if (canvas) {
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.download = 'edited-image.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          
          toast({
            title: "Image downloaded",
            description: "Your edited image has been saved.",
          });
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was an error saving your image.",
        variant: "destructive",
      });
    }
  };

  // Available filters
  const filters = [
    { name: 'vibrant', label: 'Vibrant' },
    { name: 'negative', label: 'Negative' },
    { name: 'natural', label: 'Natural' },
    { name: 'luminous', label: 'Luminous' },
    { name: 'dramatic', label: 'Dramatic' },
    { name: 'quiet', label: 'Quiet' },
    { name: 'cosy', label: 'Cosy' },
    { name: 'ethereal', label: 'Ethereal' },
    { name: 'bw', label: 'B&W' },
    { name: 'binary', label: 'Binary' },
    { name: 'amber', label: 'Amber' },
    { name: 'gold', label: 'Gold' },
    { name: 'rosegold', label: 'Rose Gold' },
    { name: 'neutral', label: 'Neutral' },
    { name: 'coolrose', label: 'Cool Rose' },
  ];

  // Available adjustments with icons
  const adjustmentOptions = [
    {
      name: 'brightness',
      label: 'Brightness',
      value: adjustments.brightness,
      min: 0,
      max: 200,
      step: 5,
      icon: <Sun size={16} className="text-gray-300" />,
    },
    {
      name: 'contrast',
      label: 'Contrast',
      value: adjustments.contrast,
      min: 0,
      max: 200,
      step: 5,
      icon: <Contrast size={16} className="text-gray-300" />,
    },
    {
      name: 'saturation',
      label: 'Saturation',
      value: adjustments.saturation,
      min: 0,
      max: 200,
      step: 5,
      icon: <PaintBucket size={16} className="text-gray-300" />,
    },
    {
      name: 'highlights',
      label: 'Highlights',
      value: adjustments.highlights,
      min: -100,
      max: 100,
      step: 5,
      icon: <Sparkles size={16} className="text-gray-300" />,
    },
    {
      name: 'shadows',
      label: 'Shadows',
      value: adjustments.shadows,
      min: -100,
      max: 100,
      step: 5,
      icon: <Cloud size={16} className="text-gray-300" />,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-editor-background overflow-hidden">
      {/* Header */}
      <header className="glass-panel p-4 flex items-center justify-between shadow-md z-10">
        <h1 className="text-2xl font-semibold text-white">Pixel Palette Pro</h1>
        <div className="text-sm text-gray-400">Frontend Preview</div>
      </header>
      
      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Sidebar */}
        <EditorSidebar
          hasImage={!!image}
          filters={filters}
          onFilterChange={handleFilterChange}
          adjustments={adjustmentOptions}
          onAdjustmentChange={handleAdjustmentChange}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onFlipHorizontal={handleFlipHorizontal}
          onFlipVertical={handleFlipVertical}
          onDownload={handleDownload}
          className="hidden md:flex"
        />
        
        {/* Main Editing Area */}
        <div className="glass-panel flex-1 flex items-center justify-center relative overflow-hidden" ref={editorRef}>
          {!image ? (
            <ImageUploader onImageSelected={handleImageSelected} className="p-6 max-w-xl w-full" />
          ) : (
            <ImageEditor
              image={image}
              filter={currentFilter}
              adjustments={adjustments}
              transformation={transformation}
              className="w-full h-full"
            />
          )}
        </div>
      </main>
      
      {/* Mobile Sidebar (shows at bottom on small screens) */}
      {image && (
        <div className="md:hidden glass-panel p-4 overflow-x-auto">
          <EditorSidebar
            hasImage={!!image}
            filters={filters}
            onFilterChange={handleFilterChange}
            adjustments={adjustmentOptions}
            onAdjustmentChange={handleAdjustmentChange}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onFlipHorizontal={handleFlipHorizontal}
            onFlipVertical={handleFlipVertical}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
