export interface IUpdateCustomerDTO {
  id: string
  cpfCnpj: string
  stateInscription?: string
  name: string
  company?: string
  email: string
  phone: string
  mobilePhone: string
  dateUpdated: Date
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
