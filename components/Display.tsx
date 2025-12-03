import React from 'react';

interface DisplayProps {
  value: string;
  hasValue: boolean;
}

export const Display: React.FC<DisplayProps> = ({ value }) => {
  // Simple logic to resize text based on length to fit screen
  const getFontSize = (length: number) => {
    if (length > 12) return 'text-4xl';
    if (length > 9) return 'text-5xl';
    if (length > 6) return 'text-6xl';
    return 'text-7xl md:text-8xl';
  };

  const fontSize = getFontSize(value.length);

  // Format number with commas for readability, but remove them for calculation logic elsewhere
  const formatValue = (val: string) => {
    if (val === 'Error') return val;
    if (val.includes('.')) {
       const [int, dec] = val.split('.');
       return `${parseInt(int).toLocaleString('en-US')}.${dec}`;
    }
    // Handle potential large integers or infinity
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  return (
    <div className="w-full h-32 md:h-40 flex items-end justify-end px-6 pb-2 mb-4">
      <span className={`${fontSize} font-light text-white tracking-tight break-all text-right transition-all duration-200`}>
        {formatValue(value)}
      </span>
    </div>
  );
};