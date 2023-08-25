import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Product {
  id?: string
  group?: string | null
  brand?: string | null
  description: string
  stock: Prisma.Decimal
  stockMinium: Prisma.Decimal
  value: Prisma.Decimal
  valueOld?: Prisma.Decimal | null
  purchaseValue: Prisma.Decimal | null
  lastPurchase?: Date | null
  lastSale?: Date | null
  createAt: Date
  und: string
  barCode?: string | null
  disableAt?: Date | null
  ncm: string
  weight?: Prisma.Decimal | null
  height?: Prisma.Decimal | null
  width?: Prisma.Decimal | null
  length?: Prisma.Decimal | null
  color?: string | null
  size?: Prisma.Decimal | null
  companyId?: string | null
  cf?: number | null
  cod?: string | null

  constructor(props: Omit<Product, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.group = props.group
    this.brand = props.brand
    this.description = props.description
    this.stock = new Prisma.Decimal(props.stock || 0)
    this.stockMinium = new Prisma.Decimal(props.stockMinium || 0)
    this.value = new Prisma.Decimal(props.value || 0)
    this.valueOld = new Prisma.Decimal(props.valueOld || 0)
    this.purchaseValue = new Prisma.Decimal(props.purchaseValue || 0)
    this.lastPurchase = props.lastPurchase
    this.lastSale = props.lastSale
    this.createAt = props.createAt
    this.und = props.und
    this.barCode = props.barCode
    this.disableAt = props.disableAt
    this.ncm = props.ncm
    this.weight = new Prisma.Decimal(props.weight || 0)
    this.height = new Prisma.Decimal(props.height || 0)
    this.width = new Prisma.Decimal(props.width || 0)
    this.length = new Prisma.Decimal(props.length || 0)
    this.color = props.color
    this.size = new Prisma.Decimal(props.size || 0)
    this.companyId = props.companyId
    this.cf = props.cf
    this.cod = props.cod
  }
}

export { Product }
