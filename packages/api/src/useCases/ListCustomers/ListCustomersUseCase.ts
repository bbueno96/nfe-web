import { CustomerRepository } from '../../repositories/CustomerRepository'
import { IListCustormersFilters } from './ListCustomersDTO'

export class ListCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(filters: IListCustormersFilters) {
    const data = await this.customerRepository.list(filters)
    return data
  }
}
