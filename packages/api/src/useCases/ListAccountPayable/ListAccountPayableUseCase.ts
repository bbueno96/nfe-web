import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { IListAccountPayableFilters } from './ListAccountPayableDTO'

export class ListAccountPayableUseCase {
  constructor(private accountPayableRepository: AccountPayableRepository) {}

  async execute(filters: IListAccountPayableFilters) {
    const data = await this.accountPayableRepository.list(filters)
    data.items.forEach(payable => {
      payable.classificationDescription = payable.Classification.description
    })
    return data
  }
}
