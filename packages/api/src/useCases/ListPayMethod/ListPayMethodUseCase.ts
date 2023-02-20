import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { IListPayMethodFilters } from './ListPayMethodDTO'

export class ListPayMethodUseCase {
  constructor(private payMethodsRepository: PayMethodsRepository) {}

  async execute(filters: IListPayMethodFilters) {
    const data = await this.payMethodsRepository.list(filters)
    return data
  }
}
