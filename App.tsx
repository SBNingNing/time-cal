import React, { useState, useEffect } from 'react';
import { Wand2, History, Delete } from 'lucide-react';
import { CalcButton } from './components/CalcButton';
import { Display } from './components/Display';
import { ButtonType, MagicState } from './types';
import { getMagicTimeNumber } from './utils/timeUtils';

const App: React.FC = () => {
  // Core Calculator State
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  
  // Magic Feature State
  const [magicState, setMagicState] = useState<MagicState>(MagicState.Idle);

  // Clear logic
  const handleAllClear = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setMagicState(MagicState.Idle);
  };

  const handleNumber = (numStr: string) => {
    if (magicState === MagicState.Frozen) return; // BLOCK INPUT

    if (waitingForSecondOperand) {
      setDisplayValue(numStr);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? numStr : displayValue + numStr);
    }
  };

  const handleDot = () => {
    if (magicState === MagicState.Frozen) return; // BLOCK INPUT

    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    if (magicState === MagicState.Frozen) return; // BLOCK INPUT

    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setDisplayValue(String(newValue));
      setFirstOperand(newValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return first / second;
      default: return second;
    }
  };

  const handleEqual = () => {
    if (magicState === MagicState.Frozen) return; // BLOCK INPUT

    const inputValue = parseFloat(displayValue);

    if (!operator || firstOperand === null) {
      return;
    }

    const result = calculate(firstOperand, inputValue, operator);
    
    // Reset for next calculation
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    // Magic state naturally resets on equal because the trick is done
    setMagicState(MagicState.Idle);
  };

  const handlePercentage = () => {
    if (magicState === MagicState.Frozen) return;
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    const fixed = (currentValue / 100).toString();
    setDisplayValue(fixed);
  };

  const handleToggleSign = () => {
    if (magicState === MagicState.Frozen) return;
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    setDisplayValue((currentValue * -1).toString());
  };

  /**
   * MAGIC LOGIC IMPLEMENTATION
   */
  const handleMagicButton = () => {
    // Condition 1: If in Idle, we enter Frozen state
    if (magicState === MagicState.Idle) {
      // This mimics the "Press once, nothing happens (keys disable)" part
      setMagicState(MagicState.Frozen);
    } 
    // Condition 2: If already Frozen, we reveal the calculated difference
    else if (magicState === MagicState.Frozen) {
      
      // The prompt specifically asks for this behavior when implementing Addition (+).
      // If we are in the middle of an addition operation (firstOperand exists, operator is +)
      if (firstOperand !== null && operator === '+') {
        const targetTime = getMagicTimeNumber();
        
        // Math: We want (FirstOperand + X) = TargetTime
        // So, X (the number we show now) = TargetTime - FirstOperand
        const magicNumber = targetTime - firstOperand;
        
        setDisplayValue(String(magicNumber));
        
        // Crucial: We tell the calculator "We just typed this number in"
        // so when the user hits '=', it calculates: FirstOperand + MagicNumber
        setWaitingForSecondOperand(false); 
        
        // Reset magic state so the user can press '='
        setMagicState(MagicState.Idle);
      } else {
        // Fallback if not using the specific trick conditions (just unfreeze)
        setMagicState(MagicState.Idle);
      }
    }
  };

  // Effect to handle global click blocking during frozen state if we wanted to be extra safe,
  // but handling it in each handler is cleaner for React.

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full max-w-md h-[100dvh] sm:h-auto sm:aspect-[9/19.5] sm:rounded-[3rem] bg-black sm:ring-8 sm:ring-neutral-800 flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* Status Bar Placeholder (Aesthetic only) */}
        <div className="flex justify-between px-8 pt-4 text-white text-sm font-medium opacity-0 sm:opacity-100">
          <span>9:41</span>
          <div className="flex space-x-2">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end">
          <Display value={displayValue} hasValue={displayValue !== '0'} />
        </div>

        {/* Keypad Area */}
        <div className="grid grid-cols-4 gap-4 px-4 pb-8 md:pb-12">
          
          {/* Row 1 */}
          <CalcButton 
            label={displayValue === '0' ? 'AC' : 'C'} 
            onClick={handleAllClear} 
            type={ButtonType.Function} 
          />
          <CalcButton 
            label="+/-" 
            onClick={handleToggleSign} 
            type={ButtonType.Function} 
          />
          <CalcButton 
            label="%" 
            onClick={handlePercentage} 
            type={ButtonType.Function} 
          />
          <CalcButton 
            label="÷" 
            onClick={() => handleOperator('÷')} 
            type={ButtonType.Operator} 
            active={operator === '÷'}
          />

          {/* Row 2 */}
          <CalcButton label="7" onClick={() => handleNumber('7')} />
          <CalcButton label="8" onClick={() => handleNumber('8')} />
          <CalcButton label="9" onClick={() => handleNumber('9')} />
          <CalcButton 
            label="×" 
            onClick={() => handleOperator('×')} 
            type={ButtonType.Operator} 
            active={operator === '×'}
          />

          {/* Row 3 */}
          <CalcButton label="4" onClick={() => handleNumber('4')} />
          <CalcButton label="5" onClick={() => handleNumber('5')} />
          <CalcButton label="6" onClick={() => handleNumber('6')} />
          <CalcButton 
            label="-" 
            onClick={() => handleOperator('-')} 
            type={ButtonType.Operator} 
            active={operator === '-'}
          />

          {/* Row 4 */}
          <CalcButton label="1" onClick={() => handleNumber('1')} />
          <CalcButton label="2" onClick={() => handleNumber('2')} />
          <CalcButton label="3" onClick={() => handleNumber('3')} />
          <CalcButton 
            label="+" 
            onClick={() => handleOperator('+')} 
            type={ButtonType.Operator} 
            active={operator === '+'}
          />

          {/* Row 5 */}
          <CalcButton 
            label="0" 
            onClick={() => handleNumber('0')} 
            doubleWidth 
            className="pl-8" // Manual adjustment for text alignment
          />
          <CalcButton label="." onClick={handleDot} />
          <CalcButton 
            label="=" 
            onClick={handleEqual} 
            type={ButtonType.Operator} 
          />
        </div>

        {/* The "Special" Button - Positioned discretely or clearly based on request.
            Prompt says "Special button on the screen".
            I'll place it floating near the top left of the keypad area or replace an unused function.
            Since standard layout is full, I will add a discreet floating action button 
            or a small icon button in the display area.
         */}
        <div className="absolute top-1/3 left-6 transform -translate-y-1/2">
           <button 
             onClick={handleMagicButton}
             className={`
               p-3 rounded-full transition-all duration-500
               ${magicState === MagicState.Frozen ? 'text-orange-500 scale-110 rotate-180' : 'text-neutral-700 hover:text-neutral-500'}
             `}
             aria-label="Magic Function"
           >
             <Wand2 size={20} />
           </button>
        </div>

        {/* Visual feedback for frozen state (Optional, keeps user informed if they don't know the trick) */}
        {magicState === MagicState.Frozen && (
          <div className="absolute inset-0 border-4 border-indigo-500/20 pointer-events-none rounded-[3rem] animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default App;