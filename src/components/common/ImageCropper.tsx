import { useState, useCallback } from 'react';
import { X, Scissors, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from './Button';
import Cropper, { type Point, type Area } from 'react-easy-crop';

interface ImageCropperProps {
  image: string; 
  aspectRatio?: number;
  onCrop: (croppedImage: Blob) => void;
  onCancel: () => void;
  title?: string;
}

export const ImageCropper = ({ 
  image, 
  aspectRatio = 1, 
  onCrop, 
  onCancel,
  title = "Crop Image" 
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (error) => reject(error));
      img.src = url;
    });

  const getCroppedImg = async () => {
      if (!croppedAreaPixels) return;
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) onCrop(blob);
      }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-brand-900/90 backdrop-blur-xl" onClick={onCancel} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-4xl overflow-hidden shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between px-8 py-6 border-b border-brand-500/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600">
              <Scissors size={20} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-brand-900">{title}</h3>
              <p className="text-brand-900/40 text-xs mt-0.5 tracking-wide">Drag to position, scroll to zoom</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-brand-500/5 flex items-center justify-center text-brand-900/30 hover:text-brand-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="relative h-100 w-full bg-brand-900/5 rounded-3xl overflow-hidden border border-brand-500/10">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: "bg-transparent",
                mediaClassName: "max-w-none"
              }}
            />
          </div>

          <div className="mt-8 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-900/40 uppercase tracking-widest">Zoom Control</span>
                <span className="text-xs font-mono font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <ZoomOut size={16} className="text-brand-900/20" />
                <input 
                  type="range" 
                  min={1} 
                  max={3} 
                  step={0.1} 
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-brand-500 h-1.5 bg-brand-500/5 rounded-full appearance-none cursor-pointer hover:accent-brand-600 transition-all"
                />
                <ZoomIn size={16} className="text-brand-900/20" />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="px-6 rounded-2xl bg-brand-500/5 hover:bg-brand-500/10 flex items-center gap-2 text-brand-600 text-sm font-bold transition-all border border-brand-500/10 active:scale-95"
              >
                <RotateCw size={18} />
                Rotate
              </button>
              <div className="flex-1 flex gap-3">
                <Button variant="outline" onClick={onCancel} className="flex-1 h-14 rounded-2xl border-brand-500/10">
                  Cancel
                </Button>
                <Button onClick={getCroppedImg} className="flex-2 h-14 rounded-2xl shadow-xl shadow-brand-500/20">
                  Apply & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
