import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sprout } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-8">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-emerald-500"
        >
          <Sprout size={80} strokeWidth={1.5} />
        </motion.div>
        <motion.div
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            y: [-20, -40, -20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute top-0 right-0 text-amber-400"
        >
          <Sparkles size={24} />
        </motion.div>
      </div>
      
      <h2 className="text-2xl font-bold text-emerald-900 mb-2">正在识别植物...</h2>
      <p className="text-emerald-600/70 max-w-xs mx-auto">
        AI 正在分析照片中的叶片、花朵和纹理细节，请稍候。
      </p>
      
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
        ))}
      </div>
    </div>
  );
}
