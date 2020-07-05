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
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Omit<Balance, 'total'>, transaction: Transaction) => {
        const transactionType = {
          income: () => (accumulator.income += transaction.value),
          outcome: () => (accumulator.outcome += transaction.value),
        };
        transactionType[transaction.type]();
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
      },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);

    return transaction;
  }
}
