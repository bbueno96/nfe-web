import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ApiError } from '../../utils/ApiError'
import { Bancos, Boletos } from '../../utils/gerar-boletos/lib/index'
export class GetBoletoPdfByInstallmentUseCase {
  constructor(private installmentRepository: InstallmentRepository) {}

  async execute(id: string) {
    const bankSlip = await this.installmentRepository.getBankSpliByInstallment(id)
    if (!bankSlip) {
      throw new ApiError('Não encontrado boletos.', 404)
    }

    return bankSlip.map(e => e.conteudo)
  }
}
