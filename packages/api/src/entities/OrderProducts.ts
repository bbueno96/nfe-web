import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class OrderProducts {
  id?: string
  orderId?: string | null
  productId?: string | null
  amount?: Prisma.Decimal | null
  unitary?: Prisma.Decimal | null
  total?: Prisma.Decimal | null
  companyId?: string | null

  constructor(props: Omit<OrderProducts, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.orderId = props.orderId
    this.productId = props.productId
    this.amount = new Prisma.Decimal(props.amount || 0)
    this.unitary = new Prisma.Decimal(props.unitary || 0)
    this.total = new Prisma.Decimal(props.total || 0)
    this.companyId = props.companyId
  }
}

export { OrderProducts }
