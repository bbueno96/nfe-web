import { v4 as uuidv4 } from 'uuid'

class BankSlipStorege {
  id?: string
  numberLot?: number
  conteudo?: string
  companyId: string
  bankAccountId: string
  wallet?: number
  createdAt?: Date

  private constructor({ numberLot, conteudo, companyId, bankAccountId, wallet }: BankSlipStorege) {
    return Object.assign(this, {
      numberLot,
      conteudo,
      companyId,
      bankAccountId,
      wallet,
    })
  }

  static create({ numberLot, conteudo, companyId, bankAccountId, wallet }: BankSlipStorege) {
    const bankSlipStorege = new BankSlipStorege({
      numberLot,
      conteudo,
      companyId,
      bankAccountId,
      wallet,
    })

    bankSlipStorege.id = uuidv4()

    return bankSlipStorege
  }
}

export { BankSlipStorege }
