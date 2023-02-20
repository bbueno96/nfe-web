import { v4 as uuidv4 } from 'uuid'

class Admin {
  id?: string
  name: string
  login: string
  password?: string
  passwordHash: string
  companyId?: string

  private constructor({ name, login, password, passwordHash, companyId }: Admin) {
    return Object.assign(this, {
      name,
      login,
      password,
      passwordHash,
      companyId,
    })
  }

  static create({ name, login, password, passwordHash, companyId }: Admin) {
    const admin = new Admin({
      name,
      login,
      password,
      passwordHash,
      companyId,
    })

    admin.id = uuidv4()

    return admin
  }
}

export { Admin }
