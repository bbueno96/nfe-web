/* eslint-disable node/no-path-concat */
import { format } from 'date-fns'
import ejs from 'ejs'

import { BudgetProductsRepository } from '../../repositories/BudgetProductsRepository'
import { BudgetRepository } from '../../repositories/BudgetRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { createInstallments } from '../../utils/Installments/installments'
import { maskCpfCnpj, maskDecimal, maskCellPhone } from '../../utils/mask'
export class GetBudgetPdfUseCase {
  constructor(
    private budgetRepository: BudgetRepository,
    private parameterRepository: ParameterRepository,
    private BudgetProductsRepository: BudgetProductsRepository,
  ) {}

  async execute(id: string) {
    const budget = await this.budgetRepository.findById(id)
    if (!budget) {
      throw new ApiError('Orçamento não encontrado.', 404)
    }
    const parameters = await this.parameterRepository.getParameter(budget.companyId)
    const { Admin, PayMethod } = budget
    let { Customer } = budget
    if (parameters.getApoio) {
      Customer = {
        name: budget.customerApoioName,
        cpfCnpj: budget.cpfCnpjApoio,
        stateInscription: budget.stateInscriptionApoio,
        address: budget.addressApoio,
        addressNumber: budget.addressNumberApoio,
        complement: budget.complementApoio,
        province: budget.provinceApoio,
        cityId: budget.cityIdApoio,
        state: budget.stateApoio,
        postalCode: budget.postalCodeApoio,
        phone: budget.phoneApoio,
      }
    }
    let installments = null
    const products = await this.BudgetProductsRepository.findByBudget(budget.id)
    if (PayMethod) installments = createInstallments(PayMethod, budget, budget.companyId)

    const report = await ejs.renderFile(`${__dirname}/../../reports/budget.ejs`, {
      customer: Customer,
      products,
      budget,
      parameters,
      employee: Admin,
      printedAt: new Date(),
      format,
      maskDecimal,
      maskCpfCnpj,
      maskCellPhone,
      PayMethod,
      installments,
    })
    return report
  }
}
