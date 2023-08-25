import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class ProductTax {
  id?: string
  product: string
  uf: string
  aliquotaIcms?: Prisma.Decimal | null
  cst?: number | null
  baseIcms?: Prisma.Decimal | null
  simplesNacional: boolean
  aliquotaIcmsSt?: Prisma.Decimal | null
  baseIcmsSt?: Prisma.Decimal | null
  mva?: Prisma.Decimal | null
  cfop: string
  cstPis?: string | null
  alqPis?: Prisma.Decimal | null
  cstCofins?: string | null
  alqCofins?: Prisma.Decimal | null
  ipi: Prisma.Decimal

  constructor(props: Omit<ProductTax, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.product = props.product
    this.uf = props.uf
    this.aliquotaIcms = new Prisma.Decimal(props.aliquotaIcms || 0)
    this.cst = props.cst
    this.baseIcms = new Prisma.Decimal(props.baseIcms || 0)
    this.simplesNacional = props.simplesNacional
    this.aliquotaIcmsSt = new Prisma.Decimal(props.aliquotaIcmsSt || 0)
    this.baseIcmsSt = new Prisma.Decimal(props.baseIcmsSt || 0)
    this.mva = new Prisma.Decimal(props.mva || 0)
    this.cfop = props.cfop
    this.cstPis = props.cstPis
    this.alqPis = new Prisma.Decimal(props.alqPis || 0)
    this.cstCofins = props.cstCofins
    this.alqCofins = new Prisma.Decimal(props.alqCofins || 0)
    this.ipi = new Prisma.Decimal(props.ipi || 0)
  }
}

export { ProductTax }
