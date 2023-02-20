export interface IUpdateAccountPayableDTO {
  id?: string
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
  disabledAt?: Date
  accountPaymentId: string
  providerName?: string
  companyId?: string
}
