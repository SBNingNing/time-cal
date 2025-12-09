import React, { useState } from 'react';
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
    // --- MAGIC BUTTON LOGIC ---
    // The Divide (÷) button is now the trigger for the magic trick.
    if (nextOperator === '÷') {
      if (magicState === MagicState.Idle) {
        // Stage 1: Freeze inputs. The app appears unresponsive.
        setMagicState(MagicState.Frozen);
      } else if (magicState === MagicState.Frozen) {
        // Stage 2: Reveal the magic number
        // If we have a first operand and the operator is '+', calculate the remainder needed to reach current time
        if (firstOperand !== null && operator === '+') {
          const targetTime = getMagicTimeNumber();
          const magicNumber = targetTime - firstOperand;
          
          setDisplayValue(String(magicNumber));
          
          // Treat this as if the user just typed the number
          setWaitingForSecondOperand(false); 
        }
        // Always unfreeze after the second press
        setMagicState(MagicState.Idle);
      }
      return; // Do not process '÷' as a mathematical operator
    }
    // --------------------------

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
      // Division case removed from active logic, but kept for type safety or fallback
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
            active={false} 
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
            className="pl-8" 
          />
          <CalcButton label="." onClick={handleDot} />
          <CalcButton 
            label="=" 
            onClick={handleEqual} 
            type={ButtonType.Operator} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;
