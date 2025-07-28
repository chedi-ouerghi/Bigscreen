import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Progress
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-primary">
            {current}
          </span>
          <span className="text-xs text-muted-foreground">of</span>
          <span className="text-sm font-medium text-muted-foreground">
            {total}
          </span>
        </div>
      </div>
      
      {/* Progress bar container */}
      <div className="relative">
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-soft">
          <div 
            className="h-full bg-gradient-primary transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress" />
          </div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < current 
                  ? 'bg-primary shadow-glow' 
                  : i === current - 1 
                  ? 'bg-primary animate-pulse' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;