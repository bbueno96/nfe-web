import { BankAccount } from '../../entities/BankAccount'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateBankAccountDTO } from './CreateBankAccountDTO'

export class CreateBankAccountUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  sanitizeData(data: ICreateBankAccountDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateBankAccountDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateBankAccountDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const brand = await this.bankAccountRepository.create(
      BankAccount.create({
        ...data,
      }),
    )
    return brand.id
  }
}
