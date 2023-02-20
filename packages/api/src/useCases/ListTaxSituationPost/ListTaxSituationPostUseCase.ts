import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { IListTaxSituationFilters } from './ListTaxSituationPostDTO'

export class ListTaxSituationPostUseCase {
  constructor(private taxSituationsRepository: TaxSituationsRepository) {}

  async execute(filters: IListTaxSituationFilters) {
    const data = await this.taxSituationsRepository.listPost(filters)
    return data
  }
}
