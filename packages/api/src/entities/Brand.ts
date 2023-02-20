import { v4 as uuidv4 } from 'uuid'

class Brand {
  id?: string
  description: string
  companyId: string

  private constructor({ description, companyId }: Brand) {
    return Object.assign(this, {
      description,
      companyId,
    })
  }

  static create({ description, companyId }: Brand) {
    const brand = new Brand({
      description,
      companyId,
    })

    brand.id = uuidv4()

    return brand
  }
}

export { Brand }
