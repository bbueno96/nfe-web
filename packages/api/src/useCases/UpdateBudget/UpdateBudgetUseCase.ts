import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateBudgetDTO } from './UpdateBudgetDTO'

export class UpdateBudgetUseCase {
  constructor(
    private budgetRepository: BudgetRepository,
    private parameterRepository: ParameterRepository,
    private budgetProductsRepository: BudgetProductsRepository,
  ) {}

  validate(data: IUpdateBudgetDTO) {
    if (!data.customerId && !data.customerApoioId) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
    if (data.BudgetProducts.length < 1) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: IUpdateBudgetDTO, prismaTransaction: PrismaTransaction) {
    const oldData = await this.budgetRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Orçamento não encontrado.', 404)
    }
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    this.validate(data)
    const budget = await this.budgetRepository.update(
      oldData.id,
      {
        id: data.id,
        customerApoioProperty: data.customerApoioProperty,
        numberBudget: oldData.numberBudget,
        status: data.status,
        deliveryForecast: data.deliveryForecast,
        customerId: data.customerId,
        employeeId: data.employeeId,
        auth: data.auth,
        payMethodId: data.payMethodId,
        companyId: data.companyId,
        customerApoioId: data.customerApoioId,
        customerApoioName: data.customerApoioName,
        obs: data.obs,
        stateInscriptionApoio: data.stateInscriptionApoio,
        emailApoio: data.emailApoio,
        phoneApoio: data.phoneApoio,
        addressApoio: data.addressApoio,
        addressNumberApoio: data.addressNumberApoio,
        complementApoio: data.complementApoio,
        provinceApoio: data.provinceApoio,
        postalCodeApoio: data.postalCodeApoio,
        stateApoio: data.stateApoio,
        cpfCnpjApoio: data.cpfCnpjApoio,
        installments: data.installments,
        paymentMean: data.paymentMean,
        propertyId: data.propertyId,
        customerIdApoio: data.customerIdApoio,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter?.getApoio ? data.cityIdApoio : null,
      },
      prismaTransaction,
    )

    const regs = data.BudgetProducts.sort(p => p.productId)
    await this.budgetProductsRepository.remove(budget.id, prismaTransaction)
    await Promise.all(
      regs.map(async Product => {
        await this.budgetProductsRepository.create(
          {
            budgetId: data.id,
            total: new Prisma.Decimal(Product.total),
            amount: new Prisma.Decimal(Product.amount),
            unitary: new Prisma.Decimal(Product.unitary),
            companyId: data.companyId,
            productId: Product.productId,
          },
          prismaTransaction,
        )
      }),
    )
  }
}
