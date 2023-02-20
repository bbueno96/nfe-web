import { ProductRepository } from '../../repositories/ProductRepository'
import { ApiError } from '../../utils/ApiError'

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new ApiError('Nenhum Produto encontrado.', 404)
    }
    return product
  }
}
