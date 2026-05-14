import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Scissors, ZoomIn, ZoomOut, RotateCw, Search, ChevronDown, Check } from 'lucide-react';
import { Button } from './Button';
import Cropper, { type Point, type Area } from 'react-easy-crop';
import { z } from "zod";
import { isValidPhoneNumber, type CountryCode, getCountries } from "libphonenumber-js";

export const registerTherapistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  countryCode: z.string().min(1, "Select country"),
  phone: z.string().min(5, "Enter a valid phone number"),
  gender: z.enum(["male", "female", "other"], {
    message: "Select gender",
  }),
  qualification: z.string().min(2, "Enter your qualification"),
  licenseNumber: z.string().min(2, "Enter your license number"),
  specialization: z.string().min(2, "Enter at least one specialization"),
  experience: z.coerce.number().min(0, "Invalid experience").max(60),
  consultationFee: z.coerce.number().min(0, "Invalid fee"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000),
  certifications: z.string().optional(),
  profileImage: z.any().optional(),
  certificationFiles: z.any().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
.superRefine((data, ctx) => {
  const { countryCode, phone, licenseNumber } = data;

  if (!isValidPhoneNumber(phone, countryCode as CountryCode)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid phone number for ${countryCode}`,
      path: ["phone"],
    });
  }

  if (countryCode === "IN") {
    if (!/^[A-Z0-9\/\-\s]{5,20}$/i.test(licenseNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Indian Medical Registration Number",
        path: ["licenseNumber"],
      });
    }
  } else if (countryCode === "GB") {
    if (!/^[0-9]{7}$/.test(licenseNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "UK GMC Number must be exactly 7 digits",
        path: ["licenseNumber"],
      });
    }
  } else if (countryCode === "AU") {
    if (!/^MED[0-9]{9,10}$/i.test(licenseNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid AHPRA Number (e.g. MED000123456)",
        path: ["licenseNumber"],
      });
    }
  } else if (countryCode === "US") {
    if (!/^[A-Z0-9]{5,15}$/i.test(licenseNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid US Medical License Format",
        path: ["licenseNumber"],
      });
    }
  }
});

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const countryNames: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", AU: "Australia", 
  CA: "Canada", AE: "United Arab Emirates", SG: "Singapore", MY: "Malaysia", 
  NZ: "New Zealand", DE: "Germany", FR: "France", ES: "Spain", IT: "Italy", 
  IE: "Ireland", ZA: "South Africa"
};

interface CountrySelectorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CountrySelector = ({ label, value, onChange, error }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = value || "IN";
  
  const allCountries = getCountries().map(code => ({
    code,
    name: countryNames[code] || code,
    flag: getFlagEmoji(code)
  })).sort((a, b) => a.name.localeCompare(b.name));

  const filtered = allCountries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="label text-brand-900/40 uppercase tracking-widest text-[10px] font-bold mb-2 block">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-brand-500/5 border-2 border-brand-500/10 rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all hover:bg-brand-500/10 focus:ring-2 focus:ring-brand-500/20 ${error ? "border-red-500/30" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none">{getFlagEmoji(selectedCountry)}</span>
          <span className="text-sm font-bold text-brand-900">{selectedCountry} <span className="text-brand-900/40 ml-1 font-medium">{countryNames[selectedCountry] || selectedCountry}</span></span>
        </div>
        <ChevronDown size={16} className={`text-brand-900/20 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[110] left-0 right-0 top-[calc(100%+8px)] bg-white border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-brand-500/10">
          <div className="p-3 border-b border-brand-500/5 bg-brand-500/5 backdrop-blur-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/20" />
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full bg-white border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-900 placeholder:text-brand-900/20 focus:ring-1 focus:ring-brand-500/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-brand-500/5 transition-colors text-left ${
                  value === country.code ? "bg-brand-500/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand-900">{country.code}</span>
                    <span className="text-[10px] text-brand-900/40">{country.name}</span>
                  </div>
                </div>
                {value === country.code && <Check size={14} className="text-brand-500" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs text-brand-900/20">No results found</div>
            )}
          </div>
        </div>
      )}
      
      {error && <p className="error-text mt-1 text-[10px]">{error}</p>}
    </div>
  );
};

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
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-brand-900/90 backdrop-blur-xl" onClick={onCancel} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl animate-fade-up">
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
          <div className="relative h-[400px] w-full bg-brand-900/5 rounded-3xl overflow-hidden border border-brand-500/10">
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
                <Button onClick={getCroppedImg} className="flex-[2] h-14 rounded-2xl shadow-xl shadow-brand-500/20">
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
