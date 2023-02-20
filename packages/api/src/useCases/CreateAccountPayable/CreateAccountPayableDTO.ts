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
  subAccounts: any[]
  providerName?: string
  companyId?: string
}
