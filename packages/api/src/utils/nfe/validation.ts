import { addYears, addMinutes } from 'date-fns'

// eslint-disable-next-line import-helpers/order-imports
import { Prisma } from '@prisma/client'
import { PrismaTransaction } from '../../../prisma/types'
import { getAliquotaTributo } from '../../custom/getAliquotaTributo'
import { getCESTByNCM } from '../../custom/getCestByNCM'
import { Nfe } from '../../entities/Nfe'
import { NfeProducts } from '../../entities/NfeProducts'
import { Parameter } from '../../entities/Parameter'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { appendLine } from '../../utils/appendLine'

export enum OperacaoNFe {
  Mesmoestado,
  Interestadual,
  Internacional,
}

export async function validationNfe(id: string, parameters: Parameter, prismaTransaction: PrismaTransaction) {
  const nfeRepository = new NfeRepository()
  const productTaxRepository = new ProductTaxRepository()
  const nfeProductsRepository = new NfeProductsRepository()
  const oneYearLater = addYears(new Date(), 1)
  let erros = ''
  const nota = await nfeRepository.findById(id)
  if (nota) {
    const updateNota: Nfe = nota

    updateNota.cep = nota.cep?.replace(/\D/g, '')
    if (nota.fone) updateNota.fone = nota.fone.replace(/\D/g, '')

    if (nota.data > oneYearLater)
      erros = appendLine(erros, 'A data da nota esta superior a 1 ano, conferir senão há cancelamento!')

    if (nota.tipo !== 'ENTRADA' && nota.tipo !== 'SAIDA')
      erros = appendLine(erros, 'tipo da Nota deve ser ENTRADA ou SAIDA!')

    if (nota.tipo === 'SAIDA' && !nota.cliente && !nota.fornecedor)
      erros = appendLine(erros, 'Favor selecionar cliente para nota de Saida!')

    if (+(nota.totalNota || 0) < 0) erros = appendLine(erros, 'Total está com valor negativo!')

    if (!nota.endereco || nota.endereco.length < 2) erros = appendLine(erros, 'Verifique o endereço!')

    if (!nota.estado || nota.estado.length < 2) erros = appendLine(erros, 'Verifique o estado!')

    if (!nota.cep || nota.cep.length < 8) erros = appendLine(erros, 'Verifique o cep!')

    if (!nota.cidade) erros = appendLine(erros, 'Verifique a cidade!')

    if (!nota.bairro || nota.bairro.length < 2) erros = appendLine(erros, 'Verifique o bairro!')

    if (!nota.numero) erros = appendLine(erros, 'Verifique o número!')

    if (!nota.razaoSocial || nota.razaoSocial.length < 2) erros = appendLine(erros, 'Verifique o bairro!')

    if (!nota.cep) erros = appendLine(erros, 'Verifique o cep!')

    const codIbge = getCityCode(nota.cidade || '', stateCode[nota.estado || 'SP'])
    if (codIbge === 0 && nota.estado?.toUpperCase() !== 'EX') erros = appendLine(erros, 'Verifique a cidade!!')

    if (!nota.volumes || Number(nota.volumes) < 0) updateNota.volumes = new Prisma.Decimal(1)

    if (!nota.especie) updateNota.especie = 'Vol'

    if (+(nota.pesoBruto ?? 0) < 0)
      erros = appendLine(erros, 'O peso bruto deve ser informado de forma numérica maior ou igual a zero!')

    if (+(nota.pesoLiquido ?? 0) < 0)
      erros = appendLine(erros, 'O peso liquído deve ser informado de forma numérica maior ou igual a zero!')

    if (+(nota.frete ?? 0) < 0)
      erros = appendLine(erros, 'O frete deve ser informado de forma numérica maior ou igual a zero!')

    if (+(nota.seguro ?? 0) < 0)
      erros = appendLine(erros, 'O seguro deve ser informado de forma numérica maior ou igual a zero!')

    if (+(nota.outrasDespesas ?? 0) < 0)
      erros = appendLine(erros, 'As outras despesas devem ser informadas de forma numérica maior ou igual a zero!')

    if (+(nota.freteOutros ?? 0) < 0)
      erros = appendLine(erros, 'O frete outros deve ser informado de forma numérica maior ou igual a zero!!')

    if (+(nota.desconto ?? 0) < 0) erros = appendLine(erros, 'desconto não deve ser informado de forma negativa!')

    let totalPagamentos = nota.totalDinheiro
      ?.add(nota.totalCheque || 0)
      .add(nota.totalCartaoDebito || 0)
      .add(nota.totalCartaoCredito || 0)
      .add(nota.totalBoleto || 0)
      .add(nota.totalOutros || 0)

    const produtos = await nfeProductsRepository.findByNfeAll(nota.id)
    if (produtos.length > 0) {
      if (produtos.length === 0) erros = appendLine(erros, 'Favor adicionar os produtos da NFe!')

      const totalProdutos = produtos.reduce(
        (acc, item) => (item.quantidade ? item.quantidade?.times(item.unitario || 0).add(acc) : acc),
        0,
      )
      if (totalProdutos === 0 && !nota.complementar) erros = appendLine(erros, 'Produto com valor zerado!')

      const items = produtos.reduce((acc, item) => (item.quantidade ? item.quantidade?.add(acc) : acc), 0)
      const outros = nota.frete?.add(nota.outrasDespesas || 0)
      const totalNota = outros?.add(totalProdutos).sub(nota.desconto || 0)
      if (!nota.orderId) {
        nota.totalOutros = new Prisma.Decimal(totalNota || 0)
        totalPagamentos = new Prisma.Decimal(totalNota || 0)
      }
      const dif = totalNota?.sub(totalPagamentos || 0)
      if ((dif || 0) > new Prisma.Decimal(0.001)) {
        erros = appendLine(erros, 'Soma das formas de pagamento é divergente do total')
      } else {
        updateNota.totalNota = totalNota
        updateNota.totalProduto = new Prisma.Decimal(parseFloat(totalProdutos?.toFixed(2)))

        updateNota.qtdePagina = parseFloat((produtos.length / 19 + 1)?.toFixed(0))
        updateNota.qtdeItens = +items
        updateNota.qtdeProdutos = produtos.length
        updateNota.baseICMS = new Prisma.Decimal(0)
        updateNota.valorICMS = new Prisma.Decimal(0)
        updateNota.valorTributo = new Prisma.Decimal(0)
      }
    }
    if (!nota.dataSaida) updateNota.dataSaida = addMinutes(nota.data, 30)

    updateNota.pesoBruto = nota.pesoBruto
    updateNota.pesoLiquido = nota.pesoBruto
    await Promise.all(
      produtos.map(async reg => {
        if (reg) {
          const updateProduto: NfeProducts = reg

          const totalProd = reg.unitario?.times(reg.quantidade || 0) || 0

          const auxNaturezaOP = nota.naturezaOp?.toUpperCase()
          if (!reg.ncm) {
            erros = appendLine(erros, 'Produto sem NCM!')
          }
          const aliquotaBaseTributo = auxNaturezaOP?.includes('VENDA') ? await getAliquotaTributo(reg.ncm) : 0
          if (totalProd === 0 && !nota.complementar) erros = appendLine(erros, 'Produto com valor zerado!')
          if ((reg?.cfop || '') === '') {
            const St = await productTaxRepository.findByUf(reg.produto || '', nota.estado || 'SP')
            if (!St) {
              erros = appendLine(erros, 'Verifique a tributação dos produtos!')
            } else {
              updateProduto.aliquotaICMS = new Prisma.Decimal((St.simplesNacional ? 0 : St.aliquotaIcms) || 0)
              updateProduto.st = St.cst || 0
              updateProduto.cfop = St.cfop
              updateProduto.cstPis = St.cstPis
              updateProduto.alqPis = new Prisma.Decimal(St.alqPis || 0)
              updateProduto.cstCofins = St.cstCofins
              updateProduto.alqCofins = new Prisma.Decimal(St.alqCofins || 0)
              updateProduto.ipi = new Prisma.Decimal(St.ipi || 0)
              updateProduto.uf = St.uf
              updateProduto.baseICMS = new Prisma.Decimal(
                St.baseIcms ? (St.baseIcms === new Prisma.Decimal(0) ? 100 : St.baseIcms) : 100,
              )
              updateProduto.baseIcmsSt = new Prisma.Decimal(
                St.baseIcmsSt ? (St.baseIcmsSt === new Prisma.Decimal(0) ? 100 : St.baseIcmsSt) : 100,
              )
              updateProduto.valorICMS = new Prisma.Decimal(
                new Prisma.Decimal(totalProd).times(updateProduto.aliquotaICMS).div(100),
              )
              updateProduto.valorBaseIcms = new Prisma.Decimal(
                new Prisma.Decimal(totalProd).times(updateProduto.baseICMS).div(100),
              )
              updateProduto.valorBaseIcmsSt = new Prisma.Decimal(
                new Prisma.Decimal(totalProd).times(updateProduto.baseIcmsSt).div(100),
              )
            }
          } else {
            updateProduto.aliquotaICMS = new Prisma.Decimal(reg.aliquotaICMS || 100)
            updateProduto.baseICMS = new Prisma.Decimal(
              reg.baseICMS ? (reg.baseICMS === new Prisma.Decimal(0) ? 100 : reg.baseICMS) : 100,
            )
            updateProduto.baseIcmsSt = new Prisma.Decimal(
              reg.baseIcmsSt ? (reg.baseIcmsSt === new Prisma.Decimal(0) ? 100 : reg.baseIcmsSt) : 100,
            )

            updateProduto.valorBaseIcms = new Prisma.Decimal(
              new Prisma.Decimal(totalProd).times(updateProduto.baseICMS).div(100),
            )
            updateProduto.valorBaseIcmsSt = new Prisma.Decimal(
              new Prisma.Decimal(totalProd).times(updateProduto.baseIcmsSt).div(100),
            )
            updateProduto.valorICMS = new Prisma.Decimal(
              new Prisma.Decimal(totalProd).times(updateProduto.aliquotaICMS).div(100),
            )
          }

          updateProduto.baseTributo = new Prisma.Decimal(totalProd).times(aliquotaBaseTributo).div(100)
          if (reg.st === 500 || reg.st === 6 || reg.st === 60) updateProduto.cest = await getCESTByNCM(reg.ncm || '')
          updateNota.baseICMS = updateNota.baseICMS.add(updateProduto.valorBaseIcms || 0)
          updateNota.valorICMS = updateNota.valorICMS?.add(updateProduto.valorICMS || 0)
          updateNota.valorTributo = updateNota.valorTributo?.add(updateProduto.baseTributo)

          await nfeProductsRepository.update(reg.id, { ...updateProduto, id: reg.id }, prismaTransaction)
        }
      }),
    )
    updateNota.status = 'Validado'

    if (erros) {
      updateNota.erros = erros
      updateNota.status = 'Erro'
    } else updateNota.erros = ''
    if (!nota.dataOrigem) updateNota.dataOrigem = nota.data
    await nfeRepository.update(nota.id, { id: nota.id, ...updateNota }, prismaTransaction)
  }
}
