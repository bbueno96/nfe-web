import { AdminRepository } from '../../repositories/AdminRepository'
import { IListAdminsFilters } from './ListAdminsDTO'

export class ListAdminsUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute(filters: IListAdminsFilters) {
    const data = await this.adminRepository.list(filters)
    return data
  }
}
