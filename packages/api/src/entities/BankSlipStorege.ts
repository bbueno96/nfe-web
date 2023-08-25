import { v4 as uuidv4 } from 'uuid'

class BankSlipStorege {
  id?: string
  installmentId?: string | null
  conteudo?: Buffer | null
  companyId?: string | null
  nfeId?: string | null

  constructor(props: Omit<BankSlipStorege, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.installmentId = props.installmentId
    this.conteudo = props.conteudo
    this.companyId = props.companyId
    this.nfeId = props.nfeId
  }
}

export { BankSlipStorege }
