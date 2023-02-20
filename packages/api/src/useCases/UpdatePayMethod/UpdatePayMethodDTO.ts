import { Prisma } from '@prisma/client'

export interface IUpdatePayMethodDTO {
  id: string
  description: string
  fine: number
  interest: number
  dueDay: number
  numberInstallments: number
  bankAccountId: string
  bankSlip: boolean
  wallet?: number
  ourNumber?: number
  createdAt?: Date
  disableAt?: Date
  companyId: string
  generateInstallmens: boolean
}
