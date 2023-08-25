import { v4 as uuidv4 } from 'uuid'

class Customer {
  id?: string
  cpfCnpj: string
  stateInscription?: string | null
  name: string
  company?: string | null
  email: string
  phone: string
  mobilePhone: string
  dateCreated: Date
  additionalEmails?: string | null
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cityId: number
  state: string
  disableAt?: Date | null
  observations?: string | null
  companyId?: string | null
  deliveryAddress?: string | null
  informarGTIN: boolean

  constructor(props: Omit<Customer, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.cpfCnpj = props.cpfCnpj
    this.name = props.name
    this.email = props.email
    this.phone = props.phone
    this.mobilePhone = props.mobilePhone
    this.dateCreated = props.dateCreated
    this.address = props.address
    this.addressNumber = props.addressNumber
    this.complement = props.complement
    this.province = props.province
    this.postalCode = props.postalCode
    this.cityId = props.cityId
    this.state = props.state
    this.companyId = props.companyId
    this.deliveryAddress = props.deliveryAddress
    this.informarGTIN = props.informarGTIN
  }
}

export { Customer }
