import { GroupRepository } from '../../repositories/GroupRepository'
import { CreateGroupController } from './CreateGroupController'
import { CreateGroupUseCase } from './CreateGroupUseCase'

const groupRepository = new GroupRepository()

const createGroupUseCase = new CreateGroupUseCase(groupRepository)

const createGroupController = new CreateGroupController(createGroupUseCase)

export { createGroupUseCase, createGroupController }
