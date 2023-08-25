import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class StockProducts {
  id?: string
  productId: string
  amount: Prisma.Decimal
  type?: string | null
  generateId?: string | null
  numeroDoc?: string | null
  number?: number | null
  typeGenerate?: number | null
  employeeId: string
  createdAt: Date
  companyId?: string | null

  constructor(props: Omit<StockProducts, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.productId = props.productId
    this.amount = new Prisma.Decimal(props.amount || 0)
    this.type = props.type
    this.generateId = props.generateId
    this.numeroDoc = props.numeroDoc
    this.number = props.number
    this.typeGenerate = props.typeGenerate
    this.employeeId = props.employeeId
    this.createdAt = props.createdAt
    this.companyId = props.companyId
  }
}

export { StockProducts }
