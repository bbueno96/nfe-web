class Cest {
  ID: string
  CEST: string
  NCM?: string | null
  DESCRICAO?: string | null

  private constructor({ CEST, NCM, DESCRICAO }: Cest) {
    return Object.assign(this, {
      CEST,
      NCM,
      DESCRICAO,
    })
  }
}

export { Cest }
