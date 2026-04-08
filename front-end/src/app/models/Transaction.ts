import { Category } from './Category';

export interface Transaction {
  _id?: string;
  accountId: string;
  amount: number;
  description: string;
  category: Category;
  type: 'income' | 'expense';
  date: string;
}
