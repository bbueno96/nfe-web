export interface ICreateCustomerDTO {
  cpfCnpj: string
  stateInscription?: string
  name: string
  company?: string
  email: string
  phone: string
  mobilePhone: string
  dateCreated: Date
  additionalEmails?: string
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cityId: number
  state: string
  disableAt?: Date
  observations?: string
  companyId: string
}
