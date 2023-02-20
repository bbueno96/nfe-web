import { Prisma } from '@prisma/client'

import { Budget } from '../../entities/Budget'
import { BudgetProducts } from '../../entities/BudgetProducts'
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

    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: ICreateBudgetDTO) {
    await this.validate(data)

    const parameter = await this.parameterRepository.getParameter(data.companyId)

    const budget = await this.budgetRepository.create(
      Budget.create({
        ...data,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter.getApoio ? getCityCode(data.cityApoio, stateCode[data.stateApoio]) : null,
      }),
    )
    data.products.forEach(async Product => {
      await this.budgetProductsRepository.create(
        BudgetProducts.create({
          budgetId: budget.id,
          ...Product,
          total: new Prisma.Decimal(Product.total),
          amount: new Prisma.Decimal(Product.amount),
          unitary: new Prisma.Decimal(Product.unitary),
          companyId: data.companyId,
        }),
      )
    })
    return budget.id
  }
}
