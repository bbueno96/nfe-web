import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { validationNfe } from '../../utils/nfe/validation'

export class GetNfeByIdUseCase {
  constructor(private NfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(id: string) {
    const nfe = await this.NfeRepository.findById(id)
    if (!nfe) {
      throw new ApiError('Nota não encontrada.', 404)
    }
    const parameter = await this.parameterRepository.getParameter(nfe.companyId)
    if (nfe.status !== 'Autorizado' && nfe.status !== 'Cancelado') {
      await validationNfe(nfe.id, parameter)
    }
    return nfe
  }
}
