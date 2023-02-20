import { BudgetRepository } from '../../repositories/BudgetRepository'
import { RemoveBudgetController } from './RemoveBudgetController'
import { RemoveBudgetUseCase } from './RemoveBudgetUseCase'

const budgetRepository = new BudgetRepository()
const removeBudgetUseCase = new RemoveBudgetUseCase(budgetRepository)

const removeBudgetController = new RemoveBudgetController(removeBudgetUseCase)

export { removeBudgetUseCase, removeBudgetController }
