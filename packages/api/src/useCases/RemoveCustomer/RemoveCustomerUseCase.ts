import { CustomerRepository } from '../../repositories/CustomerRepository'
import { ApiError } from '../../utils/ApiError'

export class RemoveCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }
    await this.customerRepository.remove({ ...customer, disableAt: new Date() })
    return customer
  }
}
