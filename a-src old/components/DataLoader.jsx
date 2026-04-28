

import React, { useState, useEffect } from 'react';

const DataLoader = () => {
  const [dots, setDots] = useState('');

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(prev => (prev === '...' ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <svg className="w-12 h-12 mb-2" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#A41460"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="125"
          strokeDashoffset="125"
          style={{ animation: "dash 1.5s ease-in-out infinite" }}
        />
      </svg>
      <p className="text-sm font-medium text-gray-700">
        Loading<span className="inline-block w-6">{dots}</span>
      </p>
      <style>
        {`
          @keyframes dash {
            0% { stroke-dashoffset: 125; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -125; }
          }
        `}
      </style>
    </div>
  );
};

export default DataLoader;
