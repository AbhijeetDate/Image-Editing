
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Sun, Contrast, PaintBucket, Sparkles, Cloud } from 'lucide-react';

interface ImageEditorProps {
  image: File | null;
  className?: string;
  filter: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    highlights: number;
    shadows: number;
  };
  transformation: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  className,
  filter,
  adjustments,
  transformation,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Create object URL when image changes
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [image]);
  
  // Apply filter and transformations
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Handle rotation
      if (transformation.rotation % 180 !== 0) {
        [width, height] = [height, width];
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Apply transformations
      ctx.save();
      
      // Move to center of canvas
      ctx.translate(width / 2, height / 2);
      
      // Rotate
      ctx.rotate((transformation.rotation * Math.PI) / 180);
      
      // Flip
      ctx.scale(
        transformation.flipHorizontal ? -1 : 1,
        transformation.flipVertical ? -1 : 1
      );
      
      // Draw image at center
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      // Restore context
      ctx.restore();
      
      // Apply filters using CSS filters since we're just mocking this part
      // In a real app, each filter would apply specific image processing logic
      
      // For now, we'll just apply CSS filters in the render method
    };
    
    img.src = imageUrl;
  }, [imageUrl, filter, adjustments, transformation]);
  
  // Mock filter styles (would be actual image processing in backend)
  const filterStyle = {
    filter: `
      brightness(${adjustments.brightness}%)
      contrast(${adjustments.contrast}%)
      saturate(${adjustments.saturation}%)
    `,
    transform: `
      rotate(${transformation.rotation}deg)
      scaleX(${transformation.flipHorizontal ? -1 : 1})
      scaleY(${transformation.flipVertical ? -1 : 1})
    `
  };
  
  // Additional filter classes (in real app these would be applied via backend processing)
  const getFilterClass = () => {
    switch (filter) {
      case 'vibrant':
        return 'saturate-150 contrast-110';
      case 'negative':
        return 'invert';
      case 'bw':
        return 'grayscale';
      case 'binary':
        return 'contrast-200 grayscale brightness-150';
      case 'natural':
        return 'brightness-105 saturate-105';
      case 'luminous':
        return 'brightness-115 contrast-105';
      case 'dramatic':
        return 'contrast-125 saturate-110 brightness-95';
      case 'quiet':
        return 'saturate-90 brightness-95';
      case 'cosy':
        return 'sepia-25 saturate-115 brightness-100';
      case 'ethereal':
        return 'brightness-110 contrast-90 saturate-90';
      case 'amber':
        return 'sepia-60';
      case 'gold':
        return 'sepia-50 saturate-150 brightness-105';
      case 'rosegold':
        return 'sepia-30 saturate-130 hue-rotate-330';
      case 'neutral':
        return 'saturate-80 brightness-100';
      case 'coolrose':
        return 'saturate-90 hue-rotate-330';
      default:
        return '';
    }
  };
  
  if (!image) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No Image Selected</p>
          <p>Upload an image to start editing</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('flex items-center justify-center h-full relative overflow-hidden', className)}>
      <div 
        className={cn(
          'relative max-w-full max-h-full transition-all duration-300',
          getFilterClass()
        )}
        style={filterStyle}
      >
        {imageUrl && (
          <img 
            src={imageUrl}
            alt="Editor preview" 
            className="max-w-full max-h-[80vh] object-contain"
          />
        )}
        <canvas 
          ref={canvasRef}
          className="hidden" // Canvas used for image processing and download
        />
      </div>
    </div>
  );
};

export default ImageEditor;
