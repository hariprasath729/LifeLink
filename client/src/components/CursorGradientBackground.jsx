import React, { useEffect } from 'react';

const CursorGradientBackground = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      document.documentElement.style.setProperty('--x', `${clientX}px`);
      document.documentElement.style.setProperty('--y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-0 transition-all duration-300" id="cursor-gradient"></div>;
};

export default CursorGradientBackground;