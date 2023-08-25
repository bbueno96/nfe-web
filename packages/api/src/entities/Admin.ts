import { v4 as uuidv4 } from 'uuid'

class Admin {
  id?: string
  name: string
  login: string
  password?: string | null
  passwordHash: string
  companyId?: string | null

  constructor(props: Omit<Admin, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.name = props.name
    this.login = props.login
    this.password = props.password
    this.passwordHash = props.passwordHash
    this.companyId = props.companyId
  }
}

export { Admin }
