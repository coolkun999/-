import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (base64Image: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-8 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex flex-col items-center justify-center gap-3 group"
      >
        <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
          <Upload size={32} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-900">上传植物照片</p>
          <p className="text-sm text-emerald-600/70">支持 JPG, PNG 格式</p>
        </div>
      </button>
    </div>
  );
}
