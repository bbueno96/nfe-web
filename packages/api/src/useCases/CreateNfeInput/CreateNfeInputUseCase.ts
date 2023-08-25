import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { ICreateNfeInputDTO } from './CreateNfeInputDTO'

export class CreateNfeInputUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private providerRepository: ProviderRepository,
    private productRepository: ProductRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private productTaxRepository: ProductTaxRepository,
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

  async execute(data: ICreateNfeInputDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)
    if (data.fornecedor) {
      const provider = await this.providerRepository.findById(data.fornecedor)
      if (provider) {
        const parameter = await this.parameterRepository.getParameter(data.companyId)
        if (data.numeroNota) {
          const nfeInput = await this.nfeRepository.findNumeroNota(data.numeroNota, provider.cpfCnpj)
          if (nfeInput) {
            throw new ApiError('Nfe Entrada já existe. Verifique.', 422)
          }
        }
        data.numeroNota = (data.numeroNota || parameter?.ultNota) ?? 1 + 1

        data.serie = data.serie ?? parameter?.serie

        const nfe = await this.nfeRepository.create(
          {
            razaoSocial: provider.name,
            rgIe: provider.stateInscription,
            cpfCnpj: provider.cpfCnpj,
            endereco: provider.address,
            numero: provider.addressNumber,
            cidade: Cities?.find(city => city.id === provider.cityId)?.name,
            estado: provider.state,
            cep: provider.postalCode,
            fone: provider.phone,
            bairro: provider.province,
            data: new Date(),
            status: '',
            volumes: new Prisma.Decimal(data.products.length),
            especie: data.especie,
            pesoBruto: new Prisma.Decimal(data.pesoBruto || 0),
            pesoLiquido: new Prisma.Decimal(data.pesoLiquido || 0),
            frete: new Prisma.Decimal(data.frete || 0),
            seguro: new Prisma.Decimal(data.seguro || 0),
            outrasDespesas: new Prisma.Decimal(data.outrasDespesas || 0),
            freteOutros: new Prisma.Decimal(data.freteOutros || 0),
            desconto: new Prisma.Decimal(data.desconto || 0),
            totalDinheiro: new Prisma.Decimal(data.totalNota || 0),
            totalBoleto: new Prisma.Decimal(0),
            totalCartaoCredito: new Prisma.Decimal(0),
            totalCartaoDebito: new Prisma.Decimal(0),
            totalCheque: new Prisma.Decimal(0),
            totalOutros: new Prisma.Decimal(0),
            totalNota: new Prisma.Decimal(data.totalNota || 0),
            totalProduto: new Prisma.Decimal(
              data.products.reduce((acc, curr) => acc.add(curr.total || 0), new Prisma.Decimal(0)),
            ),
            qtdePagina: 0,
            qtdeItens: 0,
            qtdeProdutos: 0,
            baseICMS: new Prisma.Decimal(data.baseICMS || 0),
            valorICMS: new Prisma.Decimal(data.valorICMS || 0),
            valorTributo: new Prisma.Decimal(data.valorTributo || 0),
            installments: '',
            vIpi: new Prisma.Decimal(data.vIpi || 0),
            vST: new Prisma.Decimal(data.vST || 0),
            dataSaida: new Date(),
            dataOrigem: new Date(),
            dataAutorizacao: new Date(),
            tipoFrete: null,
            sequencia: 0,
            estorno: false,
            complementar: false,
            impressa: false,
            dataImpressao: new Date(),
            emailEnviado: false,
            processado: false,
            dDi: new Date(),
            cliente: null,
            companyId: data.companyId,
            fornecedor: provider.id,
            numeroNota: data.numeroNota,
            serie: data.serie,
            naturezaOp: data.naturezaOp,
            orderId: null,
            paymentMethodId: null,
            propertyId: null,
            tipo: data.tipo.toUpperCase(),
            transpNome: data.transpNome?.substring(0, 20),
            observacoes: data.observacoes || '',
          },
          prismaTransaction,
        )
        await Promise.all(
          data.products.map(async reg => {
            if (reg && reg.produto) {
              const prod = await this.productRepository.findById(reg.produto)
              if (prod) {
                const St = await this.productTaxRepository.findByUf(prod.id, provider.state)
                if (St && prod) {
                  await this.nfeProductsRepository.create(
                    {
                      nota: nfe.id,
                      produto: prod.id,
                      cod: prod.cod,
                      descricao: prod.description,
                      ncm: prod.ncm,
                      quantidade: reg.quantidade,
                      unitario: reg.unitario,
                      total: reg.total,
                      stNfe: null,
                      producttax: St.id,
                      baseICMS: St.baseIcms,
                      valorICMS: St.baseIcmsSt,
                      aliquotaICMS: new Prisma.Decimal(St.simplesNacional ? 0 : St.aliquotaIcms ?? 0),
                      st: St.cst || 0,
                      cfop: St.cfop || '',
                      companyId: data.companyId,
                      unidade: prod.und,
                      cstPis: St.cstPis,
                      alqPis: St.alqPis,
                      cstCofins: St.cstCofins,
                      alqCofins: St.alqCofins,
                      pisCofins: false,
                      cf: prod.cf,
                      ipi: St.ipi,
                      uf: St.uf,
                      valorBaseIcms: new Prisma.Decimal(0),
                      valorBaseIcmsSt: new Prisma.Decimal(0),
                    },
                    prismaTransaction,
                  )
                } else {
                  await this.nfeProductsRepository.create(
                    {
                      nota: nfe.id,
                      produto: prod.id,
                      cod: prod.cod,
                      descricao: prod.description,
                      ncm: prod.ncm,
                      producttax: null,
                      quantidade: reg.quantidade,
                      unitario: reg.unitario,
                      total: reg.total,
                      stNfe: null,
                      baseICMS: new Prisma.Decimal(0),
                      valorICMS: new Prisma.Decimal(0),
                      aliquotaICMS: new Prisma.Decimal(0),
                      st: 0,
                      cfop: reg.cfop || '',
                      companyId: data.companyId,
                      unidade: prod.und,
                      cstPis: null,
                      alqPis: new Prisma.Decimal(0),
                      cstCofins: null,
                      alqCofins: new Prisma.Decimal(0),
                      pisCofins: false,
                      cf: prod.cf,
                      ipi: new Prisma.Decimal(0),
                      uf: '',
                      valorBaseIcms: new Prisma.Decimal(0),
                      valorBaseIcmsSt: new Prisma.Decimal(0),
                    },
                    prismaTransaction,
                  )
                }
                await this.productRepository.update(
                  prod.id,
                  {
                    stock: prod.stock.add(reg.quantidade ?? 0),
                  },
                  prismaTransaction,
                )
                await this.stockProductsRepository.create(
                  {
                    productId: prod.id,
                    amount: new Prisma.Decimal(reg?.quantidade ?? 0),
                    type: 'E',
                    generateId: nfe.id,
                    numeroDoc: '' + nfe.numeroNota,
                    number: nfe.serie,
                    typeGenerate: 1,
                    employeeId: data.employeeId,
                    companyId: data.companyId,
                    createdAt: nfe.data,
                  },
                  prismaTransaction,
                )
              }
            }
          }),
        )
        if (data.installments) {
          await Promise.all(
            data?.installments?.map(async installment => {
              await this.accountPayableRepository.create(
                { ...installment, classificationId: parameter?.classificationId || installment?.classificationId },
                prismaTransaction,
              )
            }),
          )
        }
        return nfe.id
      } else {
        throw new ApiError('Fornecedor não encontrado.', 422)
      }
    }
  }
}
