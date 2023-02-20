import { Prisma } from '@prisma/client'

import { GroupRepository } from '../../repositories/GroupRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateGroupDTO } from './UpdateGroupDTO'

export class UpdateGroupUseCase {
  constructor(private brandRepository: GroupRepository) {}

  sanitizeData(data: IUpdateGroupDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateGroupDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateGroupDTO) {
    const oldData = await this.brandRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Vendedor não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.brandRepository.update({
      ...data,
    })
  }
}
