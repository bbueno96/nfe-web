import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { ApiError } from '../../utils/ApiError'

export class GetBankAccountByIdUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(id: string) {
    const customer = await this.bankAccountRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
