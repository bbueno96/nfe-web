import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateBudgetDTO } from './CreateBudgetDTO'

export class CreateBudgetUseCase {
  constructor(
    private budgetRepository: BudgetRepository,
    private budgetProductsRepository: BudgetProductsRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  validate(data: ICreateBudgetDTO) {
    if (!data.customerId && !data.customerApoioId) {
      throw new ApiError('Cliente é obrigatório.', 422)
    }

    if (data.products.length < 1) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }

    if (!data.paymentMean) {
      throw new ApiError('Informe forma de pagamento', 422)
    }
  }

  async execute(data: ICreateBudgetDTO, prismaTransaction: PrismaTransaction) {
    this.validate(data)

    const parameter = await this.parameterRepository.getParameter(data.companyId)

    const budget = await this.budgetRepository.create(
      {
        numberBudget: data.numberBudget,
        createdAt: data.createdAt,
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
        customerApoioProperty: data.customerApoioProperty,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter?.getApoio ? getCityCode(data.cityApoio || '', stateCode[data.stateApoio || '']) : null,
      },
      prismaTransaction,
    )

    await Promise.all(
      data.products.map(async Product => {
        await this.budgetProductsRepository.create(
          {
            budgetId: budget.id,
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
    return budget.id
  }
}
