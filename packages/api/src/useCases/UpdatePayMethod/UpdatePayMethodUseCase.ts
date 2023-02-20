import { Prisma } from '@prisma/client'

import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdatePayMethodDTO } from './UpdatePayMethodDTO'

export class UpdatePayMethodUseCase {
  constructor(private payMethodsRepository: PayMethodsRepository) {}

  sanitizeData(data: IUpdatePayMethodDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdatePayMethodDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdatePayMethodDTO) {
    const oldData = await this.payMethodsRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Vendedor não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.payMethodsRepository.update({
      ...data,
      fine: new Prisma.Decimal(data.fine),
      interest: new Prisma.Decimal(data.interest),
    })
  }
}
