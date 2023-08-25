import { AccountPayment } from '../../entities/AccountPayment'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateAccountPaymentDTO {
  createdAt: Date
  value: number
  paymentMeanId: number
  bankAccountId: string
  companyId?: string
  accountsSelected: AccountPayment[]
}
