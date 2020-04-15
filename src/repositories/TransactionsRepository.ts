import Transaction from '../models/Transaction';

interface CreateTransationDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        accumulator.income +=
          transaction.type === 'income' ? transaction.value : 0;
        accumulator.outcome +=
          transaction.type === 'outcome' ? transaction.value : 0;

        accumulator.total = accumulator.income - accumulator.outcome;

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }

  public create({ title, value, type }: CreateTransationDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (type === 'outcome') {
      if (balance.total < value) {
        throw Error('Dont have balance!');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
