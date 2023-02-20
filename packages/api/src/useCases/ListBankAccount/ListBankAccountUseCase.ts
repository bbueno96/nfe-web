import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { IListBankAccountFilters } from './ListBankAccountDTO'

export class ListBankAccountUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(filters: IListBankAccountFilters) {
    const data = await this.bankAccountRepository.list(filters)
    return data
  }
}
