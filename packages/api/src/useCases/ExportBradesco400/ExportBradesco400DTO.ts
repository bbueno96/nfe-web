import { Installment } from '../../entities/Installment'

export interface IExportBradesco400DTO {
  installments: Installment[]
  bankAccountId: string
  companyId: string
  wallet: number
}
