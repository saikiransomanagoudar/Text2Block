import React, { useEffect, useState } from 'react';

const LoadingAnimation = () => {
  const [dots, setDots] = useState([]);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return [];
        return [...prev, '.'];
      });
    }, 500);

    const blockInterval = setInterval(() => {
      setBlocks(prev => {
        if (prev.length >= 3) return [];
        return [...prev, '▢'];
      });
    }, 400);

    return () => {
      clearInterval(dotInterval);
      clearInterval(blockInterval);
    };
  }, []);

  return (
    <div className="inline-flex items-center min-w-[88px] justify-center">
      <span>Blockifying</span>
      <div className="inline-flex w-6">
        {dots.map((_, i) => (
          <span key={i}>.</span>
        ))}
      </div>
      <div className="flex">
        {blocks.map((_, i) => (
          <span 
            key={i}
            className="animate-bounce inline-block"
            style={{ 
              animationDelay: `${i * 150}ms`,
              animationDuration: '1s'
            }}
          >
            ▢
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;