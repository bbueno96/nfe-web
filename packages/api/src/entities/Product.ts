import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Product {
  id?: string
  group?: string
  brand?: string
  description: string
  stock: Prisma.Decimal
  stockMinium?: Prisma.Decimal
  value: Prisma.Decimal
  valueOld: Prisma.Decimal
  purchaseValue: Prisma.Decimal
  lastPurchase?: Date
  lastSale?: Date
  createAt: Date
  st: string
  und: string
  barCode: string
  ipi: Prisma.Decimal
  disableAt?: Date
  ncm: string
  cfop: string
  pisCofins: boolean
  weight: Prisma.Decimal
  height: Prisma.Decimal
  width: Prisma.Decimal
  length: Prisma.Decimal
  color: string
  size: Prisma.Decimal
  companyId: string
  cstPis?: string
  alqPis?: Prisma.Decimal
  cstCofins?: string
  alqCofins?: Prisma.Decimal
  cf?: number
  cod?: string
  private constructor({
    group,
    brand,
    description,
    stock,
    stockMinium,
    value,
    valueOld,
    purchaseValue,
    lastPurchase,
    lastSale,
    createAt,
    st,
    und,
    barCode,
    ipi,
    disableAt,
    ncm,
    cfop,
    pisCofins,
    weight,
    height,
    width,
    length,
    color,
    size,
    companyId,
    cstPis,
    alqPis,
    cstCofins,
    alqCofins,
    cf,
    cod,
  }: Product) {
    return Object.assign(this, {
      group,
      brand,
      description,
      stock,
      stockMinium,
      value,
      valueOld,
      purchaseValue,
      lastPurchase,
      lastSale,
      createAt,
      st,
      und,
      barCode,
      ipi,
      disableAt,
      ncm,
      cfop,
      pisCofins,
      weight,
      height,
      width,
      length,
      color,
      size,
      companyId,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cf,
      cod,
    })
  }

  static create(
    {
      group,
      brand,
      description,
      stock,
      stockMinium,
      value,
      valueOld,
      purchaseValue,
      lastPurchase,
      lastSale,
      createAt,
      st,
      und,
      barCode,
      ipi,
      disableAt,
      ncm,
      cfop,
      pisCofins,
      weight,
      height,
      width,
      length,
      color,
      size,
      companyId,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cf,
      cod,
    }: Product,
    id?: string,
  ) {
    const product = new Product({
      group,
      brand,
      description,
      stock,
      stockMinium,
      value,
      valueOld,
      purchaseValue,
      lastPurchase,
      lastSale,
      createAt,
      st,
      und,
      barCode,
      ipi,
      disableAt,
      ncm,
      cfop,
      pisCofins,
      weight,
      height,
      width,
      length,
      color,
      size,
      companyId,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cf,
      cod,
    })

    product.id = id || uuidv4()
    return product
  }
}

export { Product }
