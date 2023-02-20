import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { IListBankRemittanceFilters } from './ListBankRemittanceDTO'

export class ListBankRemittanceUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(filters: IListBankRemittanceFilters) {
    const data = await this.installmentRepository.listLot(filters)
    return data
  }
}
