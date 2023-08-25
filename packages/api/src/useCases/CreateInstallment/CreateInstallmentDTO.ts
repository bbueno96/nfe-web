import { AccountPayable } from '../../entities/AccountPayable'
import { Customer } from '../../entities/Customer'

export interface ICreateInstallmentDTO {
  numeroDoc: string
  customerId?: string
  numberInstallment: number
  dueDate: Date
  value: number
  createdAt?: Date
  classificationId?: string
  discount?: number
  addition?: number
  bankAccountId?: string
  bankSlip?: boolean
  customerApoioId?: string
  installments?: number
  subAccounts: AccountPayable[]
  customerApoioName?: string
  cpfCnpjApoio?: string
  phoneApoio: string
  postalCodeApoio: string
  addressApoio: string
  stateApoio: string
  cityApoio: string
  stateInscriptionApoio
  employeeId: string
  companyId?: string
  Customer?: Customer
}
