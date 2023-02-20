import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateBankAccountDTO } from './UpdateBankAccountDTO'

export class UpdateBankAccountUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  sanitizeData(data: IUpdateBankAccountDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateBankAccountDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateBankAccountDTO) {
    const oldData = await this.bankAccountRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Conta não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.bankAccountRepository.update({
      ...data,
    })
  }
}
