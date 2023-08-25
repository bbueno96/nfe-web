import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'

export class GetNfeByIdUseCase {
  constructor(private NfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(id: string) {
    const nfe = await this.NfeRepository.findByIdProducts(id)
    if (!nfe) {
      throw new ApiError('Nota não encontrada.', 404)
    }

    return nfe
  }
}
