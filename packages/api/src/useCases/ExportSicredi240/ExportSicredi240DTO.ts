import { Installment } from '../../entities/Installment'

export interface IExportSicredi240DTO {
  installments: Installment[]
  bankAccountId: string
  wallet: number
  companyId: string
}
