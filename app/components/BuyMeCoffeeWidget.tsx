import React from 'react';
import Image from 'next/image';

const BuyMeCoffeeWidget: React.FC = () => {
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
