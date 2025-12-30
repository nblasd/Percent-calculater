
export enum CalcMode {
  BASIC = 'BASIC',
  REVERSE = 'REVERSE',
  CHANGE = 'CHANGE'
}

export interface CalculationResult {
  value: number;
  description: string;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  type: CalcMode;
  inputs: { [key: string]: number };
  result: number;
  timestamp: Date;
}
