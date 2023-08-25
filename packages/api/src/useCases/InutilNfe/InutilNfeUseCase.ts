import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { inutilizarNFe } from '../../utils/nfe/inutilizar'
import { IInutilNfeDTO } from './InutilNfeDTO'

export class InutilNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: IInutilNfeDTO) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (!parameter) {
      throw new ApiError('Nenhuma configuração encontrada.', 404)
    }
    const nfe = await this.nfeRepository.findById(data?.id || '')
    if (!nfe) {
      throw new ApiError('Nenhuma nota encontrada.', 404)
    }
    const inutilNfe = await inutilizarNFe(nfe, parameter)
    return inutilNfe
  }
}
