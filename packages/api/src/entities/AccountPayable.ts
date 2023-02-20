import { Prisma } from '@prisma/client'

class AccountPayable {
  id?: string
  createdAt: Date
  description: string
  dueDate: Date
  value: Prisma.Decimal
  discount: Prisma.Decimal
  addition: Prisma.Decimal
  numberInstallment: number
  installments: number
  providerId: string
  document: string
  classificationId: string
  disabledAt?: Date
  accountPaymentId?: string
  providerName?: string
  companyId?: string

  private constructor({
    createdAt,
    description,
    dueDate,
    value,
    discount,
    addition,
    numberInstallment,
    installments,
    providerId,
    document,
    classificationId,
    accountPaymentId,
    providerName,
    companyId,
  }: AccountPayable) {
    return Object.assign(this, {
      createdAt,
      description,
      dueDate,
      value,
      discount,
      addition,
      numberInstallment,
      installments,
      providerId,
      document,
      classificationId,
      accountPaymentId,
      providerName,
      companyId,
    })
  }

  static create({
    createdAt,
    description,
    dueDate,
    value,
    discount,
    addition,
    numberInstallment,
    installments,
    providerId,
    document,
    classificationId,
    accountPaymentId,
    providerName,
    companyId,
  }: AccountPayable) {
    const accountPayable = new AccountPayable({
      createdAt,
      description,
      dueDate,
      value,
      discount,
      addition,
      numberInstallment,
      installments,
      providerId,
      document,
      classificationId,
      accountPaymentId,
      providerName,
      companyId,
    })

    return accountPayable
  }
}

export { AccountPayable }
