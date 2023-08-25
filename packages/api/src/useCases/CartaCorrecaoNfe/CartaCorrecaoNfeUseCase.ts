import { prisma } from '../../database/client'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { cartacorrecaoNFe } from '../../utils/nfe/cartacorrecao'
import { ICartaCorrecaoNfeDTO } from './CartaCorrecaoNfeDTO'

export class CartaCorrecaoNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: ICartaCorrecaoNfeDTO) {
    const { nota } = data
    if (nota.id) {
      const nfe = await this.nfeRepository.findById(nota.id)
      if (!nfe) {
        throw new ApiError('Nenhuma nota encontrada.', 404)
      }

      const parameter = await this.parameterRepository.getParameter(data.companyId)
      if (!parameter) {
        throw new ApiError('Nenhuma configuração encontrada.', 404)
      }
      await prisma.$queryRaw`UPDATE nfe SET "cartaCorrecao"=${data.carta} WHERE id=${nfe.id}`
      if (nfe.status === 'Autorizado') {
        return await cartacorrecaoNFe(nfe, parameter)
      }
    }
    return false
  }
}
