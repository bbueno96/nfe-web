import { GroupRepository } from '../../repositories/GroupRepository'
import { IListGroupFilters } from './ListGroupDTO'

export class ListGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(filters: IListGroupFilters) {
    const data = await this.groupRepository.list(filters)
    return data
  }
}
