import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CreateBudgetController } from './CreateBudgetController'
import { CreateBudgetUseCase } from './CreateBudgetUseCase'

const budgetRepository = new BudgetRepository()
const budgetProductsRepository = new BudgetProductsRepository()
const parameterRepository = new ParameterRepository()

const createBudgetUseCase = new CreateBudgetUseCase(budgetRepository, budgetProductsRepository, parameterRepository)

const createBudgetController = new CreateBudgetController(createBudgetUseCase)

export { createBudgetUseCase, createBudgetController }
