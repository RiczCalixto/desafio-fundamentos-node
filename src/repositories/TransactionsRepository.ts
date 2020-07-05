import { Transaction } from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ListTransactions {
  transactions: Transaction[];
  balance: Balance;
}

export class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ListTransactions {
    return { transactions: this.transactions, balance: this.getBalance() };
  }

  public getBalance(): Balance {
    const income = this.sumValues('income');
    const outcome = this.sumValues('outcome');
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);

    return transaction;
  }

  private sumValues(incomeOrOutcome: 'income' | 'outcome'): number {
    return this.transactions.reduce(
      (acc, currentValue) =>
        currentValue.type === incomeOrOutcome ? acc + currentValue.value : acc,
      0,
    );
  }
}
