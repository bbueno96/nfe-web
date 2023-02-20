import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { ApiError } from '../../utils/ApiError'

export class GetAccountPayableByIdUseCase {
  constructor(private accountPayableRepository: AccountPayableRepository) {}

  async execute(id: string) {
    const accountPayable = await this.accountPayableRepository.findById(id)

    if (!accountPayable) {
      throw new ApiError('Nenhum contas a pagar encontrado.', 404)
    }

    return accountPayable
  }
}
