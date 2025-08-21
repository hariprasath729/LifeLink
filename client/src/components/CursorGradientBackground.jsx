import React, { useState, useEffect } from 'react';

const CursorGradientBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const backgroundStyle = {
    background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(247, 37, 133, 0.15), transparent 80%)`,
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
      style={backgroundStyle}
    ></div>
  );
};

export default CursorGradientBackground;