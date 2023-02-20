import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { cancelNFe } from '../../utils/nfe/cancel'
import { ICancelNfeDTO } from './CancelNfeDTO'

export class CancelNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: ICancelNfeDTO) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    const nfe = await this.nfeRepository.findById(data.id)

    const cancelNfe = await cancelNFe(nfe, parameter)
    return cancelNfe
  }
}
