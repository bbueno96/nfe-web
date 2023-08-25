import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { AccountPaymentRepository } from '../../repositories/AccountPaymentRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateAccountPaymentDTO } from './CreateAccountPaymentDTO'

export class CreateAccountPaymentUseCase {
  constructor(
    private accountPaymentRepository: AccountPaymentRepository,
    private accountPayableRepository: AccountPayableRepository,
  ) {}

  validate(data: ICreateAccountPaymentDTO) {
    if (!data.bankAccountId) {
      throw new ApiError('A conta é obrigatória.', 422)
    }
    if (!data.paymentMeanId) {
      throw new ApiError('O meio de pagamento é obrigatório.', 422)
    }
  }

  async execute(data: ICreateAccountPaymentDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)

    const accountPayment = await this.accountPaymentRepository.create(
      {
        createdAt: data.createdAt,
        paymentMeanId: data.paymentMeanId,
        bankAccountId: data.bankAccountId,
        companyId: data.companyId,
        value: new Prisma.Decimal(data.value),
      },
      prismaTransaction,
    )
    if (accountPayment) {
      await Promise.all(
        data.accountsSelected.map(async reg => {
          if (reg.id) {
            const account = await this.accountPayableRepository.findById(reg.id)
            if (account) {
              await this.accountPayableRepository.update(
                account.id,
                {
                  accountPaymentId: accountPayment.id,
                },
                prismaTransaction,
              )
            }
          }
        }),
      )
      return accountPayment.id
    }
  }
}
