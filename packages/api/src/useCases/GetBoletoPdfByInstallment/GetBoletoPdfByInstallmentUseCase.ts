import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ApiError } from '../../utils/ApiError'
export class GetBoletoPdfByInstallmentUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(id: string) {
    const bankSlip = await this.installmentRepository.getBankSpliByInstallment(id, null)
    if (!bankSlip) {
      throw new ApiError('Não encontrado boletos.', 404)
    }

    return bankSlip.map(e => e.conteudo)
  }
}
