import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'

export class GetParameterUseCase {
  constructor(private parameterRepository: ParameterRepository) {}

  async execute(companyId: string, serie: number) {
    const parameter = await this.parameterRepository.getParameter(companyId)
    const ultNfe = await this.parameterRepository.lastNumeroNota(companyId, serie < 0 ? parameter.serie : serie)
    const ultBudget = await this.parameterRepository.lastBudget(companyId)
    const ultOrder = await this.parameterRepository.lastOrder(companyId)
    console.log(ultNfe)
    parameter.ultNota = ultNfe && ultNfe?.numeroNota > parameter.ultNota ? ultNfe?.numeroNota : parameter.ultNota
    parameter.ultBudget = ultBudget?.numberBudget
    parameter.ultOrder = ultOrder?.numberOrder

    if (!parameter) {
      throw new ApiError('Nenhum parametro encontrado.', 404)
    }

    return parameter
  }
}
