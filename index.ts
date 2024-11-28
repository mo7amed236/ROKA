export interface Representative {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  date: string;
  carNumber: string;
  meterReading: string;
  description: string;
  amount: number;
}