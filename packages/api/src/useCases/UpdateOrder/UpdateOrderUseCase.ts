import { Prisma } from '@prisma/client'

import { Order } from '../../entities/Order'
import { OrderProducts } from '../../entities/OrderProducts'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateOrderDTO } from './UpdateOrderDTO'

export class UpdateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderProductsRepository: OrderProductsRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  validate(data: IUpdateOrderDTO) {
    if (!data.customerId && !data.customerApoioId) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateOrderDTO) {
    const oldData = await this.orderRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Orçamento não encontrado.', 404)
    }

    this.validate(data)
    const parameter = await this.parameterRepository.getParameter(data.companyId)

    await this.orderRepository.update(
      Order.create({
        ...data,
        numberOrder: oldData.numberOrder,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter.getApoio ? data.cityIdApoio : null,
      }),
    )
    await this.orderProductsRepository.remove(data.id)
    data.products.forEach(async Product => {
      await this.orderProductsRepository.create(
        OrderProducts.create({
          orderId: data.id,
          ...Product,
          total: new Prisma.Decimal(Product.total),
          amount: new Prisma.Decimal(Product.amount),
          unitary: new Prisma.Decimal(Product.unitary),
          companyId: data.companyId,
        }),
      )
    })
  }
}
