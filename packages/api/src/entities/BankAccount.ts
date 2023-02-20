class BankAccount {
  id?: string
  description: string
  institution: number
  number: number
  verifyingDigit: number
  agency: number
  disabledAt?: Date
  companyId?: string
  ourNumber?: number
  sequenceLot?: number
  wallet?: number

  private constructor({
    description,
    institution,
    number,
    verifyingDigit,
    agency,
    companyId,
    ourNumber,
    sequenceLot,
    wallet,
  }: BankAccount) {
    return Object.assign(this, {
      description,
      institution,
      number,
      verifyingDigit,
      agency,
      companyId,
      ourNumber,
      sequenceLot,
      wallet,
    })
  }

  static create({
    description,
    institution,
    number,
    verifyingDigit,
    agency,
    companyId,
    ourNumber,
    sequenceLot,
    wallet,
  }: BankAccount) {
    const bankAccount = new BankAccount({
      description,
      institution,
      number,
      verifyingDigit,
      agency,
      companyId,
      ourNumber,
      sequenceLot,
      wallet,
    })

    return bankAccount
  }
}

export { BankAccount }
