class Classification {
  id?: string
  description: string
  code: string
  isGroup: boolean
  parentId?: string
  disabledAt?: Date
  companyId?: string

  private constructor({ description, code, isGroup, companyId }: Classification) {
    return Object.assign(this, {
      description,
      code,
      isGroup,
      companyId,
    })
  }

  static create({ description, code, isGroup, companyId }: Classification) {
    const classification = new Classification({
      description,
      code,
      isGroup,
      companyId,
    })

    return classification
  }
}

export { Classification }
