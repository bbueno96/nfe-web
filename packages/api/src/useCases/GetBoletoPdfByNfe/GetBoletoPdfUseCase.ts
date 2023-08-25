import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ApiError } from '../../utils/ApiError'

export class GetBoletoPdfUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(id: string) {
    const bankSlip = await this.installmentRepository.getBankSpliByNfe(id, null)
    if (!bankSlip) {
      throw new ApiError('Não encontrado boletos para essa nota.', 404)
    }

    return bankSlip.map(e => e.conteudo)
  }
}
