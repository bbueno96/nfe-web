import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { IListTaxSituationFilters } from './ListTaxSituationDTO'

export class ListTaxSituationUseCase {
  constructor(private taxSituationsRepository: TaxSituationsRepository) {}

  async execute(filters: IListTaxSituationFilters) {
    const data = await this.taxSituationsRepository.list(filters)
    return data
  }
}
