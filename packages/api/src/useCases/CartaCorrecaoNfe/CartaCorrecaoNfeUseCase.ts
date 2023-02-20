import { prisma } from '../../database/client'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { cartacorrecaoNFe } from '../../utils/nfe/cartacorrecao'
import { ICartaCorrecaoNfeDTO } from './CartaCorrecaoNfeDTO'

export class CartaCorrecaoNfeUseCase {
  constructor(private nfeRepository: NfeRepository, private parameterRepository: ParameterRepository) {}

  async execute(data: ICartaCorrecaoNfeDTO) {
    const { nota } = data
    const { entity } = nota
    let nfe = await this.nfeRepository.findById(entity.id)
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    await prisma.$queryRaw`UPDATE nfe SET "cartaCorrecao"=${data.carta} WHERE id=${nfe.id}`
    nfe = await this.nfeRepository.findById(entity.id)
    if (nfe.status === 'Autorizado') {
      await cartacorrecaoNFe(nfe, parameter)
    }
  }
}
