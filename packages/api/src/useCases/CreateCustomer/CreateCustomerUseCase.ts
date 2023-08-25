import { CustomerRepository } from '../../repositories/CustomerRepository'
import { ApiError } from '../../utils/ApiError'
import { isCnpj, isCpf } from '../../utils/cpfCnpj'
import { ICreateCustomerDTO } from './CreateCustomerDTO'

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  sanitizeData(data: ICreateCustomerDTO) {
    data.name = data.name?.trim()
    data.cpfCnpj = data.cpfCnpj?.replace(/\D/g, '')
    data.email = data.email?.trim()
    data.phone = data.phone?.replace(/\D/g, '')
    data.mobilePhone = data.mobilePhone?.replace(/\D/g, '')
    data.postalCode = data.postalCode?.replace(/\D/g, '')
  }

  async validate(data: ICreateCustomerDTO) {
    if (!isCnpj(data.cpfCnpj) && !isCpf(data.cpfCnpj)) {
      throw new ApiError('O CNPJ/CPF é obrigatório.', 422)
    } else if (await this.customerRepository.hasCnpj(data.cpfCnpj)) {
      throw new ApiError('Já existe um cliente com o CNPJ informado.', 409)
    }
    if (!data.name) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateCustomerDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const customer = await this.customerRepository.create({
      ...data,
    })
    return customer.id
  }
}
