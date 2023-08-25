import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'

export class CreateNfeReturnUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  async execute(id: string, prismaTransaction: PrismaTransaction) {
    const oldData = await this.nfeRepository.findByIdProducts(id)
    if (oldData) {
      const parameter = await this.parameterRepository.getParameter(oldData?.companyId || '')
      const auxLastNota = parameter?.ultNota || 1 + 1
      oldData.numeroNota = auxLastNota
      oldData.serie = oldData.serie ?? (parameter?.serie || 1)
      try {
        const nfe = await this.nfeRepository.create(
          {
            ...oldData,
            data: new Date(),
            status: 'Envio Pendente',
            tipo: 'ENTRADA',
            naturezaOp: 'Devolução Mercadoria',
            nfeRef: oldData?.chave?.replace('NFe', '') || '',
            nomeLote: null,
            impressa: false,
            emailEnviado: false,
            chave: null,
            reciboLote: null,
            cartaCorrecao: null,
            statuscartaCorrecao: null,
            nSeqEventos: null,
            erros: '',
            processado: false,
            installments: null,
            paymentMean: null,
          },
          prismaTransaction,
        )
        await Promise.all(
          oldData.NfeProduto.map(async Product => {
            await this.nfeProductsRepository.create(
              {
                nota: nfe.id,
                produto: Product.produto,
                cod: Product.cod,
                descricao: Product.descricao,
                ncm: Product.ncm,
                producttax: null,
                quantidade: Product.quantidade,
                unitario: Product.unitario,
                total: Product.total,
                stNfe: null,
                baseICMS: new Prisma.Decimal(0),
                valorICMS: new Prisma.Decimal(0),
                aliquotaICMS: new Prisma.Decimal(0),
                st: 0,
                cfop: '',
                companyId: Product.companyId,
                unidade: Product.unidade,
                cstPis: null,
                alqPis: new Prisma.Decimal(0),
                cstCofins: null,
                alqCofins: new Prisma.Decimal(0),
                pisCofins: false,
                cf: Product.cf,
                ipi: new Prisma.Decimal(0),
                uf: '',
                valorBaseIcms: new Prisma.Decimal(0),
                valorBaseIcmsSt: new Prisma.Decimal(0),
              },
              prismaTransaction,
            )
          }),
        )
        if (parameter)
          await this.parameterRepository.update(
            parameter.id,
            { ...parameter, ultNota: nfe.numeroNota },
            prismaTransaction,
          )

        return nfe.id
      } catch (err) {
        console.log(err)
      }
    } else throw new ApiError('Nota não encontrada.', 404)
  }
}
