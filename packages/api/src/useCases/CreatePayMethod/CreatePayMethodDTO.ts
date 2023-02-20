export interface ICreatePayMethodDTO {
  description: string
  fine: number
  interest: number
  dueDay: number
  numberInstallments: number
  bankAccountId: string
  bankSlip: boolean
  wallet?: number
  createdAt?: Date
  disableAt?: Date
  companyId: string
  generateInstallmens: boolean
}
