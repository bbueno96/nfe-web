import { Prisma } from '@prisma/client'

import { PayMethod } from '../../entities/PayMethod'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreatePayMethodDTO } from './CreatePayMethodDTO'

export class CreatePayMethodUseCase {
  constructor(private payMethodRepository: PayMethodsRepository) {}

  sanitizeData(data: ICreatePayMethodDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreatePayMethodDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
    if (!data.bankAccountId) {
      throw new ApiError('a Conta é obrigatório.', 422)
    }
    if (!data.dueDay) {
      throw new ApiError('O dia do vencimento é obrigatório.', 422)
    }
    if (!data.numberInstallments) {
      throw new ApiError('Quantidade de parcelas é obrigatório.', 422)
    }
  }

  async execute(data: ICreatePayMethodDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const payMethod = await this.payMethodRepository.create(
      PayMethod.create({
        ...data,
        fine: new Prisma.Decimal(data.fine),
        interest: new Prisma.Decimal(data.interest),
      }),
    )
    return payMethod.id
  }
}
