import { Prisma } from '@prisma/client'

import { Nfe } from '../../entities/Nfe'
import { NfeProducts } from '../../entities/NfeProducts'
import { StockProducts } from '../../entities/StockProducts'
import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { ICreateNfeInputDTO } from './CreateNfeInputDTO'

export class CreateNfeInputUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private providerRepository: ProviderRepository,
    private productRepository: ProductRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private taxSituationsRepository: TaxSituationsRepository,
    private parameterRepository: ParameterRepository,
    private accountPayableRepository: AccountPayableRepository,
    private stockProductsRepository: StockProductsRepository,
  ) {}

  validate(data: ICreateNfeInputDTO) {
    if (!data.fornecedor) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: ICreateNfeInputDTO) {
    await this.validate(data)
    const provider = await this.providerRepository.findById(data.fornecedor)
    const parameter = await this.parameterRepository.getParameter(data.companyId)

    const lastNota = await this.parameterRepository.lastNumeroNota(data.companyId, parameter.serie)
    data.numeroNota = data.numeroNota || lastNota.numeroNota + 1

    data.serie = data.serie || parameter.serie

    const nfe = await this.nfeRepository.create(
      Nfe.create({
        ...data,
        razaoSocial: provider.name,
        rgIe: provider.stateInscription,
        cpfCnpj: provider.cpfCnpj,
        endereco: provider.address,
        numero: provider.addressNumber,
        cidade: Cities.find(city => city.id === provider.cityId).name,
        estado: provider.state,
        cep: provider.postalCode,
        fone: provider.phone,
        bairro: provider.province,
        data: new Date(),
        status: '',
        volumes: new Prisma.Decimal(data.products.length),
        especie: data.especie,
        pesoBruto: data.pesoBruto
          ? new Prisma.Decimal(data.pesoBruto)
          : new Prisma.Decimal(data.products.reduce((acc, curr) => acc + parseFloat(curr.peso), 0)),
        pesoLiquido: data.pesoLiquido
          ? new Prisma.Decimal(data.pesoLiquido)
          : new Prisma.Decimal(data.products.reduce((acc, curr) => acc + parseFloat(curr.peso), 0)),
        frete: new Prisma.Decimal(data.frete),
        seguro: new Prisma.Decimal(data.seguro),
        outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
        freteOutros: new Prisma.Decimal(data.freteOutros || 0),
        desconto: new Prisma.Decimal(data.desconto),
        totalDinheiro: new Prisma.Decimal(data.totalNota),
        totalBoleto: new Prisma.Decimal(0),
        totalCartaoCredito: new Prisma.Decimal(0),
        totalCartaoDebito: new Prisma.Decimal(0),
        totalCheque: new Prisma.Decimal(0),
        totalOutros: new Prisma.Decimal(0),
        totalNota: new Prisma.Decimal(data.totalNota),
        totalProduto: new Prisma.Decimal(data.products.reduce((acc, curr) => acc + curr.total, 0)),
        qtdePagina: 0,
        qtdeItens: 0,
        qtdeProdutos: 0,
        baseICMS: new Prisma.Decimal(data.baseICMS || 0),
        valorICMS: new Prisma.Decimal(data.valorICMS || 0),
        valorTributo: new Prisma.Decimal(data.valorTributo || 0),
        dataSaida: data.dataSaida,
        dataOrigem: null,
        dataAutorizacao: null,
        tipoFrete: null,
        sequencia: 0,
        paymentMethodId: undefined,
        vIpi: new Prisma.Decimal(data.vIpi),
        vST: new Prisma.Decimal(data.vST),
      }),
    )
    data.products.forEach(async Product => {
      const prod = await this.productRepository.findById(Product.produto)

      const St = await this.taxSituationsRepository.findById(prod.st)

      await this.nfeProductsRepository.create(
        NfeProducts.create({
          nota: nfe.id,
          produto: prod.id,
          descricao: prod.description,
          ncm: prod.ncm,
          quantidade: Product.quantidade,
          unitario: Product.unitario,
          total: Product.total,
          stNfe: prod.st,
          baseICMS: new Prisma.Decimal(0),
          valorICMS: new Prisma.Decimal(0),
          aliquotaICMS: new Prisma.Decimal(St.simplesNacional ? 0 : St.aliquotaIcms),
          st: St.cst,
          cfop: Product.cfop,
          companyId: data.companyId,
          unidade: prod.und,
          pisCofins: true,
        }),
      )
      await this.productRepository.update({
        ...prod,
        stock: new Prisma.Decimal(parseFloat('' + prod.stock) + parseFloat(Product.quantidade)),
      })
      await this.stockProductsRepository.create(
        StockProducts.create({
          productId: prod.id,
          amount: Product.quantidade,
          type: 'E',
          generateId: nfe.id,
          numeroDoc: '' + nfe.numeroNota,
          number: nfe.serie,
          typeGenerate: 1,
          employeeId: data.employeeId,
          companyId: data.companyId,
          createdAt: nfe.data,
        }),
      )
    })

    data.installments.forEach(async installment => {
      await this.accountPayableRepository.create({ ...installment, classificationId: parameter.classificationId })
    })

    return nfe.id
  }
}
