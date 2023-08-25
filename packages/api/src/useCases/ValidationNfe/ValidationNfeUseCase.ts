import { PrismaTransaction } from '../../../prisma/types'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { validationNfe } from '../../utils/nfe/validation'
import { IValidationNfeDTO } from './ValidationNfeDTO'

export class ValidationNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: IValidationNfeDTO, prismaTransaction: PrismaTransaction) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (data.id && parameter) await validationNfe(data.id, parameter, prismaTransaction)
  }
}
