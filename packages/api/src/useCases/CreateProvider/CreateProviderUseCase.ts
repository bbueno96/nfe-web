import { Prisma } from '@prisma/client'

import { Provider } from '../../entities/Provider'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ApiError } from '../../utils/ApiError'
import { isCnpj, isCpf } from '../../utils/cpfCnpj'
import { ICreateProviderDTO } from './CreateProviderDTO'

export class CreateProviderUseCase {
  constructor(private providerRepository: ProviderRepository) {}

  sanitizeData(data: ICreateProviderDTO) {
    data.name = data.name?.trim()
    data.cpfCnpj = data.cpfCnpj?.replace(/\D/g, '')
    data.email = data.email?.trim()
    data.phone = data.phone?.replace(/\D/g, '')
    data.mobilePhone = data.mobilePhone?.replace(/\D/g, '')
    data.postalCode = data.postalCode?.replace(/\D/g, '')
  }

  async validate(data: ICreateProviderDTO) {
    if (!isCnpj(data.cpfCnpj) && !isCpf(data.cpfCnpj)) {
      throw new ApiError('O CNPJ/CPF é obrigatório.', 422)
    } else if (await this.providerRepository.hasCnpj(data.cpfCnpj)) {
      throw new ApiError('Já existe um cliente com o CNPJ informado.', 409)
    }
    if (!data.name) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateProviderDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const provider = await this.providerRepository.create(
      Provider.create({
        ...data,
      }),
    )
    return provider.id
  }
}
