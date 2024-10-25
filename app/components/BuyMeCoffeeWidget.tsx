'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const BuyMeCoffeeWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth > 768);
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up the event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a href="https://www.buymeacoffee.com/vamshichintu02" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/bmc-button.png" 
          alt="Buy Me A Coffee" 
          width={217} 
          height={60} 
        />
      </a>
    </div>
  );
};

export default BuyMeCoffeeWidget;
