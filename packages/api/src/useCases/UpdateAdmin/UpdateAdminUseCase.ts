import { AdminRepository } from '../../repositories/AdminRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateAdminDTO } from './UpdateAdminDTO'

export class UpdateAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  sanitizeData(data: IUpdateAdminDTO) {
    data.name = data.name?.trim()
  }

  validate(data: IUpdateAdminDTO) {
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

  async execute(data: IUpdateAdminDTO) {
    if (data.id) {
      const reg = await this.adminRepository.findById(data.id)
      if (!reg) {
        throw new ApiError('Usuario não encontrado.', 404)
      }
      this.sanitizeData(data)
      await this.validate(data)

      const admin = await this.adminRepository.update(reg.id, {
        ...data,
      })

      return admin.id
    }
  }
}
