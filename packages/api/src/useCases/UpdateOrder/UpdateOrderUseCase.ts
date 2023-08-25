import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
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

  async execute(data: IUpdateOrderDTO, prismaTransaction: PrismaTransaction) {
    const oldData = await this.orderRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Orçamento não encontrado.', 404)
    }

    this.validate(data)
    const parameter = await this.parameterRepository.getParameter(data.companyId)

    await this.orderRepository.update(
      oldData.id,
      {
        numberOrder: oldData.numberOrder,
        obs: data.obs,
        status: data.status,
        customerApoioProperty: data.customerApoioProperty,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter?.getApoio ? data.cityIdApoio : null,
      },
      prismaTransaction,
    )
    await this.orderProductsRepository.remove(data.id)
    const regs = data.products
    await Promise.all(
      regs.map(async reg => {
        await this.orderProductsRepository.create(
          {
            orderId: data.id,
            total: reg.total,
            amount: reg.amount,
            unitary: reg.unitary,
            companyId: data.companyId,
            productId: reg.productId,
          },
          prismaTransaction,
        )
      }),
    )
  }
}
