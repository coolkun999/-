import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('无法访问摄像头。请确保已授予权限。');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md aspect-[3/4] bg-neutral-900 overflow-hidden rounded-2xl shadow-2xl">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              <button
                onClick={onCancel}
                className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={capturePhoto}
                className="p-6 rounded-full bg-white text-emerald-600 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Camera size={32} />
              </button>
              <div className="w-14" /> {/* Spacer */}
            </div>
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              <button
                onClick={retake}
                className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                <span>重拍</span>
              </button>
              <button
                onClick={confirm}
                className="p-4 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2 px-8"
              >
                <Check size={24} />
                <span className="font-semibold">识别</span>
              </button>
            </div>
          </>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg"
              >
                返回
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
