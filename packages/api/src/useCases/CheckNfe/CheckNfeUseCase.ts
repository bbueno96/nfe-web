import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { check } from '../../utils/nfe/check'
import { ICheckNfeDTO } from './CheckNfeDTO'

export class CheckNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: ICheckNfeDTO) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (data.id) {
      const nfe = await this.nfeRepository.findById(data.id)
      if (!nfe) {
        throw new ApiError('Nenhuma nota encontrada.', 404)
      }
      if (!parameter) {
        throw new ApiError('Nenhuma configuração encontrada.', 404)
      }
      if (nfe.reciboLote) {
        const checkNfe = await check(nfe.reciboLote ?? '', parameter)
        return checkNfe
      }
    }
  }
}
