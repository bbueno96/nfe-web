import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class StockProducts {
  id?: string
  productId: string
  amount: Prisma.Decimal
  type: string
  generateId: string
  numeroDoc: string
  number: number
  typeGenerate: number
  employeeId: string
  createdAt: Date
  companyId: string

  private constructor({
    productId,
    amount,
    type,
    generateId,
    numeroDoc,
    number,
    typeGenerate,
    employeeId,
    createdAt,
    companyId,
  }: StockProducts) {
    return Object.assign(this, {
      productId,
      amount,
      type,
      generateId,
      numeroDoc,
      number,
      typeGenerate,
      employeeId,
      createdAt,
      companyId,
    })
  }

  static create({
    productId,
    amount,
    type,
    generateId,
    numeroDoc,
    number,
    typeGenerate,
    employeeId,
    createdAt,
    companyId,
  }: StockProducts) {
    const stockProducts = new StockProducts({
      productId,
      amount,
      type,
      generateId,
      numeroDoc,
      number,
      typeGenerate,
      employeeId,
      createdAt,
      companyId,
    })

    stockProducts.id = uuidv4()

    return stockProducts
  }
}

export { StockProducts }
