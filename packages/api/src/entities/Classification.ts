class Classification {
  id?: string
  description?: string | null
  code?: string | null
  isGroup: boolean
  parentId?: string | null
  disabledAt?: Date | null
  companyId?: string | null

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
