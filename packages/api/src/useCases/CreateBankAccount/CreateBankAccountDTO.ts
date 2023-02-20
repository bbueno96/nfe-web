export interface ICreateBankAccountDTO {
  id?: string
  description: string
  institution: number
  number: number
  verifyingDigit: number
  agency: number
  disabledAt?: Date
  companyId?: string
  ourNumber?: number
  wallet?: number
}
