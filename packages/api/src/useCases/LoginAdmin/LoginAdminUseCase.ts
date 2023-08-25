import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AdminRepository } from '../../repositories/AdminRepository'
import { ApiError } from '../../utils/ApiError'
import { ILoginAdminDTO } from './LoginAdminDTO'
import { ILoginAdminUserDTO } from './LoginAdminUserDTO'

export class LoginAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  sanitizeData(data: ILoginAdminDTO) {
    data.login = data.login?.trim()
    data.password = data.password?.trim()
  }

  validate(data: ILoginAdminDTO) {
    if (!data.login) {
      throw new ApiError('O login é obrigatório.', 422)
    }

    if (!data.password) {
      throw new ApiError('A senha é obrigatória.', 422)
    }
  }

  async execute(data: ILoginAdminDTO) {
    this.sanitizeData(data)
    this.validate(data)

    const admin = await this.adminRepository.findByLogin(data.login)
    if (admin) {
      const isValid = await bcrypt.compare(data.password, admin?.passwordHash || '')

      if (!isValid) {
        throw new ApiError('Login ou senha está incorreto.', 422)
      }

      const payload: TokenOperator = {
        id: admin.id,
        name: admin.name,
        companyId: admin.companyId || '',
        roles: ['Admin'],
      }

      const user: ILoginAdminUserDTO = {
        id: admin.id,
        name: admin.name,
      }

      const accessToken = jwt.sign(payload, process.env.APP_SECRET || '', { expiresIn: '24h' })

      return {
        accessToken,
        user,
      }
    }
  }
}
