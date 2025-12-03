import React from 'react';
import { ButtonType } from '../types';

interface CalcButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  type?: ButtonType;
  className?: string;
  active?: boolean;
  doubleWidth?: boolean;
}

export const CalcButton: React.FC<CalcButtonProps> = ({
  label,
  onClick,
  type = ButtonType.Number,
  className = '',
  active = false,
  doubleWidth = false,
}) => {
  let baseStyles = "h-20 md:h-24 text-3xl rounded-full font-medium transition-all duration-150 active:scale-95 flex items-center justify-center select-none";
  
  // Color mapping based on iOS calculator style
  let colorStyles = "bg-neutral-800 text-white hover:bg-neutral-700"; // Default Number

  if (type === ButtonType.Function) {
    colorStyles = "bg-neutral-400 text-black hover:bg-neutral-300"; // Top row (AC, +/-)
  } else if (type === ButtonType.Operator) {
    colorStyles = active 
      ? "bg-white text-orange-500" 
      : "bg-orange-500 text-white hover:bg-orange-400"; // Operators (+, -, =)
  } else if (type === ButtonType.Special) {
    colorStyles = "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"; // Magic Button
  }

  const widthClass = doubleWidth ? "col-span-2 w-full aspect-[2.1/1]" : "col-span-1 aspect-square";
  // Special adjustment for round buttons to ensure they are circles
  const shapeClass = doubleWidth ? "rounded-full pl-8 !justify-start" : "rounded-full";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${colorStyles} ${widthClass} ${shapeClass} ${className}`}
    >
      {label}
    </button>
  );
};