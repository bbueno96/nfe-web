import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ApiError } from '../../utils/ApiError'
import { Bancos, Boletos } from '../../utils/gerar-boletos/lib/index'
export class GetBoletoPdfUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(id: string) {
    const bankSlip = await this.installmentRepository.getBankSpliByNfe(id)
    if (!bankSlip) {
      throw new ApiError('Não encontrado boletos para essa nota.', 404)
    }

    return bankSlip.map(e => e.conteudo)
  }
}
