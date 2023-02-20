import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ApiError } from '../../utils/ApiError'

export class GetBudgetByIdUseCase {
  constructor(private budgetRepository: BudgetRepository, private budgetProductsRepository: BudgetProductsRepository) {}

  async execute(id: string) {
    const budget = await this.budgetRepository.findById(id)

    if (!budget) {
      throw new ApiError('Nenhum Orçamento Encontrado.', 404)
    }
    const BudgetProducts = await this.budgetProductsRepository.findByBudget(budget.id)

    return { ...budget, BudgetProducts }
  }
}
