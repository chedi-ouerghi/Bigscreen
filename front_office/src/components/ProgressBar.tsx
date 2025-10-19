import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showSteps?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showSteps = true
}) => {
  // Calcul du pourcentage en toute sécurité
  const rawPercentage = total > 0 ? (current / total) * 100 : 0;
  const percentage = Math.min(100, Math.max(0, Number.isFinite(rawPercentage) ? rawPercentage : 0));

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="sticky top-4 z-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-4 mb-8 transition-all duration-300 hover:shadow-xl">
      {/* Informations de progression */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium text-gray-700">
          Progression : {current} / {total}
        </div>
        <div className="text-sm font-semibold text-blue-600">
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Barre de progression principale */}
      <div 
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3"
        role="progressbar" 
        aria-valuenow={Math.round(percentage)} 
        aria-valuemin={0} 
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500 ease-out rounded-full relative overflow-hidden"
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Points d'étapes */}
      {showSteps && (
        <div className="flex justify-between px-1">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white shadow-sm ${
                  i < current 
                    ? 'bg-blue-500 scale-125' 
                    : i === current
                    ? 'bg-blue-300 border-blue-500 scale-110'
                    : 'bg-gray-300'
                }`}
              />
              <span className={`text-xs mt-1.5 transition-colors font-medium ${
                i <= current ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;