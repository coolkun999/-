import React, { useState } from 'react';
import { Camera, Leaf, History, Settings, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CameraCapture } from './components/CameraCapture';
import { ImageUpload } from './components/ImageUpload';
import { PlantResult } from './components/PlantResult';
import { LoadingState } from './components/LoadingState';
import { identifyPlant, PlantIdentificationResult } from './services/geminiService';

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIdentification = async (image: string) => {
    setIsCameraOpen(false);
    setIsLoading(true);
    setCurrentImage(image);
    setError(null);
    
    try {
      const data = await identifyPlant(image);
      setResult(data);
    } catch (err) {
      console.error('Identification error:', err);
      setError('抱歉，识别过程中出现了问题。请尝试换一张更清晰的照片。');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={reset} style={{ cursor: 'pointer' }}>
            <div className="p-2 bg-emerald-500 rounded-xl text-white">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">FloraID</h1>
          </div>
          <div className="flex items-center gap-4 text-emerald-800/60">
            <button className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
              <History size={20} />
            </button>
            <button className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!isLoading && !result && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="text-center space-y-4 py-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4"
                >
                  <Sparkles size={14} />
                  <span>AI 智能植物识别</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-black text-emerald-950 leading-tight">
                  发现身边的<br />
                  <span className="text-emerald-600">绿色奇迹</span>
                </h2>
                <p className="text-lg text-emerald-800/60 max-w-md mx-auto">
                  只需拍一张照片，即可识别数千种植物，并获取专业的养护建议。
                </p>
              </section>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="group relative h-64 bg-emerald-600 rounded-3xl p-8 flex flex-col justify-end overflow-hidden shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  <div className="absolute top-8 right-8 text-white/20 group-hover:scale-110 transition-transform">
                    <Camera size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10 text-left">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4">
                      <Camera size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">拍照识别</h3>
                    <p className="text-emerald-100/80">实时开启相机拍摄</p>
                  </div>
                </button>

                <ImageUpload onUpload={handleIdentification} />
              </div>

              {/* Tips Section */}
              <section className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Info size={20} />
                  </div>
                  <h4 className="font-bold text-emerald-900">拍照小贴士</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Tip
                    title="光照充足"
                    desc="在明亮的自然光下拍摄，避免阴影遮挡。"
                  />
                  <Tip
                    title="对焦清晰"
                    desc="确保植物主体位于画面中心并对焦准确。"
                  />
                  <Tip
                    title="细节完整"
                    desc="尽量拍到叶片、花朵或果实的特写。"
                  />
                </div>
              </section>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {result && currentImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PlantResult
                result={result}
                image={currentImage}
                onReset={reset}
              />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-900">识别失败</h3>
              <p className="text-red-700/70">{error}</p>
              <button
                onClick={reset}
                className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Camera Overlay */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleIdentification}
          onCancel={() => setIsCameraOpen(false)}
        />
      )}

      {/* Footer Decoration */}
      <footer className="py-12 text-center text-emerald-900/30 text-sm">
        <p>© 2026 FloraID · AI 植物学家</p>
      </footer>
    </div>
  );
}

function Tip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <h5 className="font-bold text-emerald-800 text-sm">{title}</h5>
      <p className="text-xs text-emerald-600/70 leading-relaxed">{desc}</p>
    </div>
  );
}
