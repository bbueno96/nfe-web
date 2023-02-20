import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { GetBudgetByIdController } from './GetBudgetByIdController'
import { GetBudgetByIdUseCase } from './GetBudgetByIdUseCase'

const budgetProductsRepository = new BudgetProductsRepository()

const budgetRepository = new BudgetRepository()
const getBudgetByIdUseCase = new GetBudgetByIdUseCase(budgetRepository, budgetProductsRepository)

const getBudgetByIdController = new GetBudgetByIdController(getBudgetByIdUseCase)

export { getBudgetByIdUseCase, getBudgetByIdController }
