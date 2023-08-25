import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ApiError } from '../../utils/ApiError'
import { isCnpj, isCpf } from '../../utils/cpfCnpj'
import { IUpdateProviderDTO } from './UpdateProviderDTO'

export class UpdateProviderUseCase {
  constructor(private providerRepository: ProviderRepository) {}

  sanitizeData(data: IUpdateProviderDTO) {
    data.name = data.name?.trim()
    data.cpfCnpj = data.cpfCnpj?.replace(/\D/g, '')
    data.email = data.email?.trim()
    data.phone = data.phone?.replace(/\D/g, '')
    data.mobilePhone = data.mobilePhone?.replace(/\D/g, '')
    data.postalCode = data.postalCode?.replace(/\D/g, '')
  }

  async validateUniqueCpf({ cpfCnpj, id, companyId }) {
    const validation = await this.providerRepository.findByCnpj(cpfCnpj, companyId)

    if (validation && validation.id !== id) {
      throw new ApiError('O CPF/CNPJ já cadastrado.', 422)
    }
  }

  validate(data: IUpdateProviderDTO) {
    if (!isCnpj(data.cpfCnpj) && !isCpf(data.cpfCnpj)) {
      throw new ApiError('O CNPJ/CPF é obrigatório.', 422)
    }
    if (!data.name) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateProviderDTO) {
    this.sanitizeData(data)
    this.validateUniqueCpf(data)
    this.validate(data)

    const provider = await this.providerRepository.findById(data.id)
    if (!provider) {
      throw new ApiError('Fornecedor não encontrado.', 404)
    }
    await this.providerRepository.update(provider.id, {
      ...data,
      dateCreated: new Date(),
    })
    return provider.id
  }
}
