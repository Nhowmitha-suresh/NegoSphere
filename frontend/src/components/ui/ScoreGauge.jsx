import React from 'react';

export const ScoreGauge = ({ score = 0, size = 120, strokeWidth = 10, label = 'Opportunity Score' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (val) => {
    if (val >= 80) return '#10B981'; // Emerald
    if (val >= 60) return '#6366F1'; // Indigo
    if (val >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Rose
  };

  const strokeColor = getColor(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">{normalizedScore}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-medium text-slate-400">{label}</span>}
    </div>
  );
};
