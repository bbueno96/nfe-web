import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { check } from '../../utils/nfe/check'
import { ICheckNfeDTO } from './CheckNfeDTO'

export class CheckNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: ICheckNfeDTO) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    const nfe = await this.nfeRepository.findById(data.id)
    const checkNfe = await check(nfe.reciboLote, parameter)
    return checkNfe
  }
}
