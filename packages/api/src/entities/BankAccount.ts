import { v4 as uuidv4 } from 'uuid'

class BankAccount {
  id?: string
  description?: string | null
  institution?: number | null
  number: number
  verifyingDigit: number
  agency: number
  disabledAt?: Date | null
  companyId?: string | null
  ourNumber?: number | null
  sequenceLot?: number | null
  wallet?: number | null

  constructor(props: Omit<BankAccount, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.description = props.description
    this.institution = props.institution
    this.number = props.number
    this.verifyingDigit = props.verifyingDigit
    this.agency = props.agency
    this.companyId = props.companyId
    this.ourNumber = props.ourNumber
    this.sequenceLot = props.sequenceLot
    this.wallet = props.wallet
  }
}

export { BankAccount }
