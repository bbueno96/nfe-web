import { v4 as uuidv4 } from 'uuid'

class Customer {
  id?: string
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

  private constructor({
    cpfCnpj,
    name,
    email,
    phone,
    mobilePhone,
    dateCreated,
    address,
    addressNumber,
    complement,
    province,
    postalCode,
    cityId,
    state,
    companyId,
  }: Customer) {
    return Object.assign(this, {
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateCreated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      cityId,
      state,
      companyId,
    })
  }

  static create(
    {
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateCreated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      companyId,
      cityId,
      state,
    }: Customer,
    id?: string,
  ) {
    const customer = new Customer({
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateCreated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      companyId,
      cityId,
      state,
    })

    customer.id = id || uuidv4()
    return customer
  }
}

export { Customer }
