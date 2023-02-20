import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { IListInstallmentFilters } from './ListInstallmentsDTO'

export class ListInstallmentUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(filters: IListInstallmentFilters) {
    const data = await this.installmentRepository.list(filters)
    return data
  }
}
