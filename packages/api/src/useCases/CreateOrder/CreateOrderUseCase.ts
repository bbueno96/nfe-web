import { Prisma } from '@prisma/client'

import { Order } from '../../entities/Order'
import { OrderProducts } from '../../entities/OrderProducts'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateOrderDTO } from './CreateOrderDTO'

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderProductsRepository: OrderProductsRepository,
    private parameterRepository: ParameterRepository,
    private budgetRepository: BudgetRepository,
  ) {}

  validate(data: ICreateOrderDTO) {
    if (!data.customerId && !data.customerApoioId) {
      throw new ApiError('Cliente é obrigatório.', 422)
    }

    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: ICreateOrderDTO) {
    await this.validate(data)
    const lastOrder = await this.parameterRepository.lastOrder(data.companyId)

    if (!data.numberOrder) {
      data.numberOrder = lastOrder?.numberOrder + 1
    }
    const budget = await this.budgetRepository.findById(data.budgetId)

    if (budget) {
      const { BudgetProducts } = budget
      const order = await this.orderRepository.create(
        Order.create({
          ...budget,
          numberOrder: data.numberOrder,
          id: null,
          total: new Prisma.Decimal(data.total),
          discount: new Prisma.Decimal(data.discount),
          shipping: new Prisma.Decimal(data.shipping),
        }),
      )
      BudgetProducts.forEach(async Product => {
        await this.orderProductsRepository.create(
          OrderProducts.create({
            orderId: order.id,
            ...Product,
            total: new Prisma.Decimal(Product.total),
            amount: new Prisma.Decimal(Product.amount),
            unitary: new Prisma.Decimal(Product.unitary),
            companyId: data.companyId,
          }),
        )
      })
      return order.id
    } else {
      const order = await this.orderRepository.create(
        Order.create({
          ...data,
          total: new Prisma.Decimal(data.total),
          discount: new Prisma.Decimal(data.discount),
          shipping: new Prisma.Decimal(data.shipping),
        }),
      )
      data.products.forEach(async Product => {
        await this.orderProductsRepository.create(
          OrderProducts.create({
            orderId: order.id,
            ...Product,
            total: new Prisma.Decimal(Product.total),
            amount: new Prisma.Decimal(Product.amount),
            unitary: new Prisma.Decimal(Product.unitary),
            companyId: data.companyId,
          }),
        )
      })
      return order.id
    }
  }
}
