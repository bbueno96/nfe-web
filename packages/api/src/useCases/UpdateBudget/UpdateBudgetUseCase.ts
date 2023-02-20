import { Prisma } from '@prisma/client'

import { Budget } from '../../entities/Budget'
import { BudgetProducts } from '../../entities/BudgetProducts'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
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
  }

  async execute(data: IUpdateBudgetDTO) {
    const oldData = await this.budgetRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Orçamento não encontrado.', 404)
    }
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    this.validate(data)

    const budget = await this.budgetRepository.update({
      ...Budget.create({
        ...data,
        id: data.id,
        numberBudget: oldData.numberBudget,
        total: new Prisma.Decimal(data.total),
        discount: new Prisma.Decimal(data.discount),
        shipping: new Prisma.Decimal(data.shipping),
        cityIdApoio: parameter.getApoio ? data.cityIdApoio : null,
      }),
    })

    await this.budgetProductsRepository.remove(budget.id)
    data.BudgetProducts.forEach(async Product => {
      await this.budgetProductsRepository.create(
        BudgetProducts.create({
          budgetId: data.id,
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
