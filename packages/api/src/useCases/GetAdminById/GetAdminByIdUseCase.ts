import { AdminRepository } from '../../repositories/AdminRepository'
import { ApiError } from '../../utils/ApiError'

export class GetAdminByIdUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute(id: string) {
    const customer = await this.adminRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
