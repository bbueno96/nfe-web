import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ApiError } from '../../utils/ApiError'

export class RemoveBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string) {
    const budget = await this.budgetRepository.findById(id)

    if (!budget) {
      throw new ApiError('Orçamento não encontrado encontrado.', 404)
    }
    if ((await this.budgetRepository.hasOrderConfirmed(budget.id)) && !budget.disabledAt) {
      throw new ApiError('Orçamento vinculado a um pedido', 404)
    }
    await this.budgetRepository.remove({ ...budget, disabledAt: budget.disabledAt ? null : new Date() }, null)
    return budget
  }
}
