import { Admin } from '../../entities/Admin'
import { AdminRepository } from '../../repositories/AdminRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateAdminDTO } from './CreateAdminDTO'

export class CreateAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  sanitizeData(data: ICreateAdminDTO) {
    data.name = data.name?.trim()
    data.login = data.login?.trim()
  }

  validate(data: ICreateAdminDTO) {
    if (!data.name) {
      throw new ApiError('o Nome é obrigatório.', 422)
    }
    if (!data.login) {
      throw new ApiError('o Login é obrigatório.', 422)
    }
    if (!data.passwordHash) {
      throw new ApiError('a Senha é obrigatório.', 422)
    }
  }

  async execute(data: ICreateAdminDTO) {
    this.sanitizeData(data)
    this.validate(data)

    const admin = Admin.create(data)
    await this.adminRepository.create(admin)

    return admin.id
  }
}
