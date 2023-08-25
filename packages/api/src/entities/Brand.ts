import { v4 as uuidv4 } from 'uuid'

class Brand {
  id?: string
  description: string
  companyId?: string | null

  constructor(props: Omit<Brand, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.description = props.description
    this.companyId = props.companyId
  }
}

export { Brand }
