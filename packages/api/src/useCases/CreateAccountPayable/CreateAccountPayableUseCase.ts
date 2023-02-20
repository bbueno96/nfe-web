import { Prisma } from '@prisma/client'

import { AccountPayable } from '../../entities/AccountPayable'
import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateAccountPayableDTO } from './CreateAccountPayableDTO'

export class CreateAccountPayableUseCase {
  constructor(private accountPayableRepository: AccountPayableRepository) {}

  sanitizeData(data: ICreateAccountPayableDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateAccountPayableDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateAccountPayableDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    if (data.subAccounts.length === 0) {
      const accountPayable = await this.accountPayableRepository.create(
        AccountPayable.create({
          ...data,
          providerName: data.providerName,
          value: new Prisma.Decimal(data.value),
          discount: new Prisma.Decimal(data.discount),
          addition: new Prisma.Decimal(data.addition),
        }),
      )
      return accountPayable
    }
    const { description, installments, providerId, document, classificationId, companyId, providerName } = data
    data.subAccounts.forEach(async account => {
      await this.accountPayableRepository.create(
        AccountPayable.create({
          ...account,
          description: `${description} (${`00${account.numberInstallment}`.slice(-2)}/${`00${installments}`.slice(
            -2,
          )})`,
          installments,
          providerId,
          document,
          providerName,
          classificationId,
          value: new Prisma.Decimal(account.value),
          discount: new Prisma.Decimal(0),
          addition: new Prisma.Decimal(0),
          companyId,
        }),
      )
    })
  }
}
