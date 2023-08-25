import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { sendEmail } from '../../utils/nfe/email'
import { IEmailNfeDTO } from './EmailNfeDTO'

export class EmailNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: IEmailNfeDTO) {
    if (data.id) {
      const parameter = await this.parameterRepository.getParameter(data.companyId)
      if (!parameter) {
        throw new ApiError('Nenhuma configuração encontrada.', 404)
      }

      const nfe = await this.nfeRepository.findById(data.id)
      if (!nfe) {
        throw new ApiError('Nota não encontrada.', 404)
      }
      const emailNfe = await sendEmail(data.id, parameter)
      return emailNfe
    }
  }
}
