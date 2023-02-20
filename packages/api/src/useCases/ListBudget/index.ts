import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ListBudgetController } from './ListBudgetController'
import { ListBudgetUseCase } from './ListBudgetUseCase'

const budgetRepository = new BudgetRepository()
const listBudgetUseCase = new ListBudgetUseCase(budgetRepository)

const listBudgetController = new ListBudgetController(listBudgetUseCase)

export { listBudgetUseCase, listBudgetController }
