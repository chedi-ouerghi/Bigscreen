// LoaderContext.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from "framer-motion";
import { LoaderContext } from './loaderCore';


export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);

  const showLoader = useCallback((start = 0) => {
    if (isNavigatingRef.current) return;
    setProgress(start);
    setIsLoading(true);
  }, []);

  const updateLoader = useCallback((value: number) => {
    if (isNavigatingRef.current) return;
    setProgress(Math.min(100, Math.max(0, Math.round(value))));
  }, []);

  const hideLoader = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLoading(false);
    setProgress(0);
    isNavigatingRef.current = false;
  }, []);

  const startLoadingAndNavigate = useCallback((path: string, navigate: (path: string) => void) => {
    if (isNavigatingRef.current) return;

    // Show loader first so UI updates; only then set navigating flag to prevent duplicate starts
    showLoader(8);
    isNavigatingRef.current = true;

    let currentProgress = 8;
    
    intervalRef.current = window.setInterval(() => {
      if (!isNavigatingRef.current) return;
      
      const remaining = 100 - currentProgress;
      const increment = Math.max(4, Math.min(12, Math.round(remaining * (0.12 + Math.random() * 0.08))));
      currentProgress = Math.min(100, currentProgress + increment);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setTimeout(() => {
          hideLoader();
          navigate(path);
        }, 350);
      }
    }, 280);
  }, [showLoader, hideLoader]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isNavigatingRef.current = false;
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ 
      isLoading, 
      progress, 
      showLoader, 
      updateLoader, 
      hideLoader, 
      startLoadingAndNavigate 
    }}>
      {children}

      {/* Modern Professional Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Background avec blur professionnel */}
          <div className="absolute inset-0 bg-white backdrop-blur-md">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Particules animées */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Orbes flottants */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Loader Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-[520px] max-w-[92vw] p-8 bg-white/96 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-80" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-5 mb-7">
                <div className="relative">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#1e90ff] via-[#4facfe] to-[#6b4cf0] text-white rounded-2xl shadow-xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full" />
                      <div className="absolute inset-2 w-4 h-4 border-2 border-white/40 border-b-white rounded-full" />
                    </motion.div>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl blur-md opacity-60" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">Préparation en cours</h3>
                  <p className="text-base text-slate-600">Configuration de votre environnement BigScreen...</p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-semibold">Progression</span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <span className="text-lg text-slate-800 font-bold tabular-nums">{Math.round(progress)}%</span>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Background track */}
                  <div className="w-full h-5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
                    {/* Progress fill */}
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#1e90ff] via-[#4facfe] to-[#6b4cf0] rounded-full relative overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{ x: [-100, 200] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          repeatDelay: 0.5 
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform skew-x-12"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Glow under progress bar */}
                  <motion.div
                    initial={{ width: "0%", opacity: 0 }}
                    animate={{ 
                      width: `${progress}%`, 
                      opacity: progress > 10 ? 0.8 : 0 
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute -bottom-3 left-0 h-3 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-blue-400/50 rounded-full blur-lg"
                  />
                </div>

                {/* Status text with icon */}
                <div className="flex items-center justify-center gap-3 pt-3">
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-slate-400 border-t-blue-500 rounded-full"
                  />
                  <motion.p
                    key={Math.floor(progress / 20)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-slate-600 font-medium"
                  >
                    {progress < 20 ? "Initialisation des composants..." : 
                     progress < 40 ? "Chargement des questions du sondage..." : 
                     progress < 60 ? "Préparation de l'interface utilisateur..." : 
                     progress < 80 ? "Configuration des paramètres..." :
                     progress < 95 ? "Finalisation de l'environnement..." : 
                     "Redirection en cours..."}
                  </motion.p>
                </div>

                {/* Mini progress indicators */}
                <div className="flex justify-center gap-2 pt-2">
                  {[20, 40, 60, 80, 100].map((threshold, index) => (
                    <motion.div
                      key={threshold}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        progress >= threshold 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-slate-300'
                      }`}
                      animate={progress >= threshold ? {
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};