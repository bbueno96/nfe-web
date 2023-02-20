import { Prisma } from '@prisma/client'

import { AccountPayment } from '../../entities/AccountPayment'
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

  async execute(data: ICreateAccountPaymentDTO) {
    await this.validate(data)

    const accountPayment = await this.accountPaymentRepository.create(
      AccountPayment.create({
        ...data,
        value: new Prisma.Decimal(data.value),
      }),
    )
    data.accountsSelected.forEach(async as => {
      const account = await this.accountPayableRepository.findById(as.id)
      await this.accountPayableRepository.update({ ...account, accountPaymentId: accountPayment.id })
    })
    return accountPayment.id
  }
}
