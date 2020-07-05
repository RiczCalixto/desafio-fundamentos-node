import { TransactionsRepository } from '../repositories/TransactionsRepository';
import { Transaction } from '../models/Transaction';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

export class CreateTransactionService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  public execute({ title, type, value }: RequestDTO): Transaction {
    const isOutcome = type === 'outcome';
    const hasEnoughMoney =
      this.transactionsRepository.getBalance().total < value;

    if (isOutcome && hasEnoughMoney) {
      throw Error('Arruma dinheiro carai');
    }

    return this.transactionsRepository.create({
      title,
      type,
      value,
    });
  }
}
