import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { UpdateBudgetController } from './UpdateBudgetController'
import { UpdateBudgetUseCase } from './UpdateBudgetUseCase'

const budgetRepository = new BudgetRepository()
const parameterRepository = new ParameterRepository()
const budgetProductsRepository = new BudgetProductsRepository()
const updateBudgetUseCase = new UpdateBudgetUseCase(budgetRepository, parameterRepository, budgetProductsRepository)

const updateBudgetController = new UpdateBudgetController(updateBudgetUseCase)

export { updateBudgetUseCase, updateBudgetController }
