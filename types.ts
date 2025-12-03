export enum ButtonType {
  Number = 'NUMBER',
  Operator = 'OPERATOR',
  Function = 'FUNCTION',
  Special = 'SPECIAL', // The magic button
}

export interface CalculatorState {
  displayValue: string;
  firstOperand: number | null;
  operator: string | null;
  waitingForSecondOperand: boolean;
}

export enum MagicState {
  Idle = 'IDLE',
  Frozen = 'FROZEN', // Stage 1: Inputs locked
}