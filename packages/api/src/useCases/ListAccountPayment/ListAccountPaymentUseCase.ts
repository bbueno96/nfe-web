import { AccountPaymentRepository } from '../../repositories/AccountPaymentRepository'
import { IListAccountPaymentFilters } from './ListAccountPaymentDTO'

export class ListAccountPaymentUseCase {
  constructor(private accountPaymentRepository: AccountPaymentRepository) {}

  async execute(filters: IListAccountPaymentFilters) {
    const data = await this.accountPaymentRepository.list(filters)
    return data
  }
}
