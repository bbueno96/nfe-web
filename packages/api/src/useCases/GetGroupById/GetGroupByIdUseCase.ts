import { GroupRepository } from '../../repositories/GroupRepository'
import { ApiError } from '../../utils/ApiError'

export class GetGroupByIdUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(id: string) {
    const customer = await this.groupRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
