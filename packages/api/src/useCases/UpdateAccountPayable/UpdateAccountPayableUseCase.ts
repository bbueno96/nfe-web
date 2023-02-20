import { Prisma } from '@prisma/client'

import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateAccountPayableDTO } from './UpdateAccountPayableDTO'

export class UpdateAccountPayableUseCase {
  constructor(private accountPayableRepository: AccountPayableRepository) {}

  sanitizeData(data: IUpdateAccountPayableDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateAccountPayableDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateAccountPayableDTO) {
    const oldData = await this.accountPayableRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Conta a Pagar não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.accountPayableRepository.update({
      ...data,
      value: new Prisma.Decimal(data.value),
      discount: new Prisma.Decimal(data.discount),
      addition: new Prisma.Decimal(data.addition),
    })
  }
}
