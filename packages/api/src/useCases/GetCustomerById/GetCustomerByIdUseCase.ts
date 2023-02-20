import { CustomerRepository } from '../../repositories/CustomerRepository'
import { ApiError } from '../../utils/ApiError'

export class GetCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
