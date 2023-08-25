import { v4 as uuidv4 } from 'uuid'
class ProviderProducts {
  id?: string
  productId?: string | null
  productIdProvider?: string | null
  providerId?: string | null
  companyId?: string | null

  constructor(props: Omit<ProviderProducts, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.productId = props.productId
    this.productIdProvider = props.productIdProvider
    this.providerId = props.providerId
    this.companyId = props.companyId
  }
}

export { ProviderProducts }
