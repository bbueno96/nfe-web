import { v4 as uuidv4 } from 'uuid'

class Group {
  id?: string
  description: string
  companyId: string

  private constructor({ description, companyId }: Group) {
    return Object.assign(this, {
      description,
      companyId,
    })
  }

  static create({ description, companyId }: Group) {
    const group = new Group({
      description,
      companyId,
    })

    group.id = uuidv4()

    return group
  }
}

export { Group }
