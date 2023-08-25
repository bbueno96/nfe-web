import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'

export class GetParameterUseCase {
  constructor(private parameterRepository: ParameterRepository) {}

  async execute(companyId: string) {
    const parameter = await this.parameterRepository.getParameter(companyId)
    const ultBudget = await this.parameterRepository.lastBudget(companyId)
    const ultOrder = await this.parameterRepository.lastOrder(companyId)

    if (parameter) {
      parameter.ultNota = parameter ? parameter.ultNota : 1
    } else {
      throw new ApiError('Nenhum parametro encontrado.', 404)
    }
    return { ...parameter, ultBudget: ultBudget?.numberBudget, ultOrder: ultOrder?.numberOrder }
  }
}
