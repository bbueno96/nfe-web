import { Prisma } from '@prisma/client'

import { Brand } from '../../entities/Brand'
import { GroupRepository } from '../../repositories/GroupRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateGroupDTO } from './CreateGroupDTO'

export class CreateGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  sanitizeData(data: ICreateGroupDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateGroupDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateGroupDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const brand = await this.groupRepository.create(
      Brand.create({
        ...data,
      }),
    )
    return brand.id
  }
}
