import { AccountPayable } from '../../entities/AccountPayable'

export interface ICreateAccountPayableDTO {
  createdAt: Date
  description: string
  dueDate: Date
  value: number
  discount: number
  addition: number
  numberInstallment: number
  installments: number
  providerId: string
  document: string
  classificationId: string
  subAccounts: AccountPayable[]
  providerName?: string
  companyId?: string
}
