import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ApiError } from '../../utils/ApiError'

export class GetPayMethodByIdUseCase {
  constructor(private payMethodsRepository: PayMethodsRepository) {}

  async execute(id: string) {
    const payMethod = await this.payMethodsRepository.findById(id)

    if (!payMethod) {
      throw new ApiError('Nenhuma forma de pagamento encontrada encontrado.', 404)
    }

    return payMethod
  }
}
