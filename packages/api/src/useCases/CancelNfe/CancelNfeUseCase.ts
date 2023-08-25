import { PrismaTransaction } from '../../../prisma/types'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { ApiError } from '../../utils/ApiError'
import { cancelNFe } from '../../utils/nfe/cancel'
import { ICancelNfeDTO } from './CancelNfeDTO'

export class CancelNfeUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private productRepository: ProductRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private stockProductsRepository: StockProductsRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  async execute(data: ICancelNfeDTO, prismaTransaction: PrismaTransaction) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    const nfe = await this.nfeRepository.findById(data.id)
    if (!nfe) {
      throw new ApiError('Nenhuma nota encontrada.', 404)
    }
    if (!parameter) {
      throw new ApiError('Nenhuma configuração encontrada.', 404)
    }
    const cancelNfe = await cancelNFe(nfe, parameter)
    if (cancelNfe && nfe.id) {
      const regs = await this.nfeProductsRepository.findByNfe(nfe.id)

      if (regs) {
        await Promise.all(
          regs.map(async reg => {
            if (reg.Product && reg.quantidade && nfe.id) {
              await this.productRepository.update(
                reg.Product.id,
                { stock: reg.Product.stock.add(reg.quantidade) },
                prismaTransaction,
              )

              await this.stockProductsRepository.create(
                {
                  productId: reg.Product.id,
                  amount: reg.quantidade,
                  type: 'E',
                  generateId: nfe.id,
                  numeroDoc: '' + nfe.numeroNota,
                  number: nfe.serie,
                  typeGenerate: 4,
                  employeeId: data.employeeId,
                  companyId: data.companyId,
                  createdAt: nfe.data,
                },
                prismaTransaction,
              )
            }
          }),
        )
      }
    }
    return cancelNfe
  }
}
