import { BudgetRepository } from '../../repositories/BudgetRepository'
import { IListBudgetFilters } from './ListBudgetDTO'

export class ListBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(filters: IListBudgetFilters) {
    const data = await this.budgetRepository.list(filters)
    return data
  }
}
