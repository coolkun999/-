import React from 'react';
import { Droplets, Sun, Thermometer, Sprout, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PlantIdentificationResult } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';

interface PlantResultProps {
  result: PlantIdentificationResult;
  image: string;
  onReset: () => void;
}

export function PlantResult({ result, image, onReset }: PlantResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mb-12"
    >
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={image}
          alt={result.commonName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-1"
          >
            {result.commonName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-200 italic font-medium"
          >
            {result.scientificName}
          </motion.p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Description */}
        <section>
          <div className="flex items-center gap-2 text-emerald-800 mb-3">
            <Info size={20} />
            <h3 className="font-bold text-lg">植物简介</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {result.description}
          </p>
        </section>

        {/* Care Instructions */}
        <section>
          <div className="flex items-center gap-2 text-emerald-800 mb-4">
            <Sprout size={20} />
            <h3 className="font-bold text-lg">养护指南</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CareItem
              icon={<Droplets className="text-blue-500" />}
              label="浇水"
              value={result.careInstructions.watering}
            />
            <CareItem
              icon={<Sun className="text-amber-500" />}
              label="光照"
              value={result.careInstructions.light}
            />
            <CareItem
              icon={<Thermometer className="text-orange-500" />}
              label="温度"
              value={result.careInstructions.temperature}
            />
            <CareItem
              icon={<Sparkles className="text-emerald-500" />}
              label="土壤"
              value={result.careInstructions.soil}
            />
          </div>
        </section>

        {/* Extra Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Sparkles size={18} />
              <h4 className="font-bold">趣味知识</h4>
            </div>
            <p className="text-sm text-emerald-900/80 italic">
              "{result.funFact}"
            </p>
          </div>

          <div className={cn(
            "p-4 rounded-2xl flex flex-col justify-center",
            result.isToxicToPets ? "bg-red-50 text-red-900" : "bg-blue-50 text-blue-900"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className={result.isToxicToPets ? "text-red-500" : "text-blue-500"} />
              <h4 className="font-bold">宠物安全</h4>
            </div>
            <p className="text-sm font-medium">
              {result.isToxicToPets ? "对宠物有毒，请小心放置。" : "对宠物安全，可以放心种植。"}
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
        >
          识别另一株植物
        </button>
      </div>
    </motion.div>
  );
}

function CareItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm text-gray-700 font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}
