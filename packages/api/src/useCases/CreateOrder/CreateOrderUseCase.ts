import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
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

    if (!data.paymentMean) {
      throw new ApiError('Informe forma de pagamento', 422)
    }
  }

  async execute(data: ICreateOrderDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)
    const lastOrder = await this.parameterRepository.lastOrder(data.companyId)
    if (!data.numberOrder) {
      data.numberOrder = lastOrder ? lastOrder?.numberOrder + 1 : 1
    }
    const budget = await this.budgetRepository.findById(data.budgetId ?? '')
    if (budget) {
      const { BudgetProducts } = budget
      if (BudgetProducts) {
        const order = await this.orderRepository.create(
          {
            createdAt: data.createdAt,
            customerId: budget.customerId,
            employeeId: budget.employeeId,
            payMethodId: budget.payMethodId,
            companyId: budget.companyId,
            obs: budget.obs,
            customerApoioId: budget.customerApoioId,
            customerApoioName: budget.customerApoioName,
            stateInscriptionApoio: budget.stateInscriptionApoio,
            emailApoio: budget.emailApoio,
            phoneApoio: budget.phoneApoio,
            addressApoio: budget.addressApoio,
            addressNumberApoio: budget.addressNumberApoio,
            complementApoio: budget.complementApoio,
            provinceApoio: budget.provinceApoio,
            postalCodeApoio: budget.postalCodeApoio,
            cityIdApoio: budget.cityIdApoio,
            stateApoio: budget.stateApoio,
            cpfCnpjApoio: budget.cpfCnpjApoio,
            installments: budget.installments,
            paymentMean: budget.paymentMean,
            propertyId: budget.propertyId,
            customerApoioProperty: budget.customerApoioProperty,
            numberOrder: data.numberOrder,
            budgetId: budget.id,
            total: new Prisma.Decimal(data.total),
            discount: new Prisma.Decimal(data.discount),
            shipping: new Prisma.Decimal(data.shipping),
          },
          prismaTransaction,
        )
        await Promise.all(
          BudgetProducts.map(async Product => {
            await this.orderProductsRepository.create(
              {
                orderId: order.id,
                total: Product.total,
                amount: Product.amount,
                unitary: Product.unitary,
                companyId: data.companyId,
                productId: Product.productId,
              },
              prismaTransaction,
            )
          }),
        )
        await this.budgetRepository.update(budget.id, { auth: true }, prismaTransaction)
        return order.id
      }
    } else {
      if (data.products) {
        const order = await this.orderRepository.create(
          {
            createdAt: data.createdAt,
            customerId: data.customerId,
            employeeId: data.employeeId,
            payMethodId: data.payMethodId,
            companyId: data.companyId,
            obs: data.obs,
            customerApoioId: data.customerApoioId,
            customerApoioName: data.customerApoioName,
            installments: data.installments,
            paymentMean: data.paymentMean,
            propertyId: data.propertyId,
            customerApoioProperty: data.customerApoioProperty,
            numberOrder: data.numberOrder,
            budgetId: null,
            total: new Prisma.Decimal(data.total),
            discount: new Prisma.Decimal(data.discount),
            shipping: new Prisma.Decimal(data.shipping),
          },
          prismaTransaction,
        )
        await Promise.all(
          data.products.map(async Product => {
            await this.orderProductsRepository.create(
              {
                orderId: order.id,
                total: Product.total,
                amount: Product.amount,
                unitary: Product.unitary,
                companyId: data.companyId,
                productId: Product.productId,
              },
              prismaTransaction,
            )
          }),
        )
        return order.id
      }
    }
  }
}
