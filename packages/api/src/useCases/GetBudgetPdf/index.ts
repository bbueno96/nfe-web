import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { GetBudgetPdfController } from './GetBudgetPdfController'
import { GetBudgetPdfUseCase } from './GetBudgetPdfUseCase'

const budgetRepository = new BudgetRepository()
const parameterRepository = new ParameterRepository()
const budgetProductsRepository = new BudgetProductsRepository()
const getBudgetPdfUseCase = new GetBudgetPdfUseCase(budgetRepository, parameterRepository, budgetProductsRepository)

const getBudgetPdfController = new GetBudgetPdfController(getBudgetPdfUseCase)

export { getBudgetPdfUseCase, getBudgetPdfController }
