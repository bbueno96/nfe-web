import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class OrderProducts {
  id?: string
  orderId: string
  productId: string
  amount: Prisma.Decimal
  unitary: Prisma.Decimal
  total: Prisma.Decimal
  companyId: string

  private constructor({ orderId, productId, amount, unitary, total, companyId }: OrderProducts) {
    return Object.assign(this, {
      orderId,
      productId,
      amount,
      unitary,
      total,
      companyId,
    })
  }

  static create({ orderId, productId, amount, unitary, total, companyId }: OrderProducts) {
    const orderProducts = new OrderProducts({
      orderId,
      productId,
      amount,
      unitary,
      total,
      companyId,
    })

    orderProducts.id = uuidv4()

    return orderProducts
  }
}

export { OrderProducts }
