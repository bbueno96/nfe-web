import { GroupRepository } from '../../repositories/GroupRepository'
import { GetGroupByIdController } from './GetGroupByIdController'
import { GetGroupByIdUseCase } from './GetGroupByIdUseCase'

const groupRepository = new GroupRepository()
const getGroupByIdUseCase = new GetGroupByIdUseCase(groupRepository)

const getGroupByIdController = new GetGroupByIdController(getGroupByIdUseCase)

export { getGroupByIdUseCase, getGroupByIdController }
