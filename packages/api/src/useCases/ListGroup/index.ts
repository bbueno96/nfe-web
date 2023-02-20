import { GroupRepository } from '../../repositories/GroupRepository'
import { ListGroupController } from './ListGroupController'
import { ListGroupUseCase } from './ListGroupUseCase'

const groupRepository = new GroupRepository()
const listGroupUseCase = new ListGroupUseCase(groupRepository)

const listGroupController = new ListGroupController(listGroupUseCase)

export { listGroupUseCase, listGroupController }
