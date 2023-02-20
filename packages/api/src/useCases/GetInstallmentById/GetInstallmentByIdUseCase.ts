import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ApiError } from '../../utils/ApiError'

export class GetInstallmentByIdUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(id: string) {
    const installment = await this.installmentRepository.findById(id)

    if (!installment) {
      throw new ApiError('Nenhum contas a receber encontrado.', 404)
    }

    return installment
  }
}
