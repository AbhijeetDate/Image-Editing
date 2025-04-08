
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, className }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, or WebP).",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Pass the file to parent component
    onImageSelected(file);
    
    toast({
      title: "Image uploaded",
      description: "Your image is ready to edit.",
    });
    
  }, [onImageSelected, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1
  });
  
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
  };

  return (
    <div className={cn(className)}>
      <div 
        {...getRootProps()} 
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-lg transition-all cursor-pointer hover:border-editor-accent min-h-[300px]',
          isDragActive && 'drag-active',
          previewUrl && 'border-none p-0'
        )}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <Button 
              onClick={clearImage}
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full"
            >
              <X size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-4 rounded-full bg-gray-800/50">
              <Upload size={36} className="text-editor-accent" />
            </div>
            <div>
              <p className="font-medium text-lg text-white">
                Drop your image here
              </p>
              <p className="text-gray-400 text-sm mt-1">
                PNG, JPG, and WebP supported
              </p>
            </div>
            <Button className="bg-editor-accent hover:bg-editor-accent-hover mt-4">
              Select from Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
