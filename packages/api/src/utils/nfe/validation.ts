import { addYears, addMinutes } from 'date-fns'

import { getAliquotaTributo } from '../../custom/getAliquotaTributo'
import { getCESTByNCM } from '../../custom/getCestByNCM'
import { Parameter } from '../../entities/Parameter'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { appendLine } from '../../utils/appendLine'
import { cfopChange } from '../../utils/cfopChange'

enum FormasPagamento {
  OutrasFormas,
  CartaoCredito,
  CartaoDebito,
  Boleto,
}

export enum OperacaoNFe {
  Mesmoestado,
  Interestadual,
  Internacional,
}
export async function validationNfe(id: string, parameters: Parameter) {
  const nfeRepository = new NfeRepository()
  const taxSituationsRepository = new TaxSituationsRepository()
  const nfeProductsRepository = new NfeProductsRepository()
  const oneYearLater = addYears(new Date(), 1)
  let erros = ''
  const nota = await nfeRepository.findById(id)
  const updateNota: any = {}
  updateNota.cep = nota.cep.replace(/\D/g, '')
  if (nota.fone) updateNota.fone = nota.fone.replace(/\D/g, '')

  if (nota.data > oneYearLater)
    erros = appendLine(erros, 'A data da nota esta superior a 1 ano, conferir senão há cancelamento!')

  if (nota.tipo !== 'ENTRADA' && nota.tipo !== 'SAIDA')
    erros = appendLine(erros, 'tipo da Nota deve ser ENTRADA ou SAIDA!')

  if (nota.tipo === 'SAIDA' && !nota.cliente) erros = appendLine(erros, 'Favor selecionar cliente para nota de Saida!')

  if (+nota.totalNota < 0) erros = appendLine(erros, 'Total está com valor negativo!')
  if (!nota.endereco || nota.endereco.length < 2) erros = appendLine(erros, 'Verifique o endereço!')

  if (!nota.estado || nota.estado.length < 2) erros = appendLine(erros, 'Verifique o estado!')

  if (!nota.cep || nota.cep.length < 8) erros = appendLine(erros, 'Verifique o cep!')

  if (!nota.cidade) erros = appendLine(erros, 'Verifique a cidade!')

  if (!nota.bairro || nota.bairro.length < 2) erros = appendLine(erros, 'Verifique o bairro!')

  if (!nota.numero) erros = appendLine(erros, 'Verifique o número!')

  if (!nota.razaoSocial || nota.razaoSocial.length < 2) erros = appendLine(erros, 'Verifique o bairro!')

  if (!nota.cep) erros = appendLine(erros, 'Verifique o cep!')

  const codIbge = getCityCode(nota.cidade, stateCode[nota.estado])
  if (codIbge === 0 && nota.estado.toUpperCase() !== 'EX') erros = appendLine(erros, 'Verifique a cidade!!')

  const produtos = await nfeProductsRepository.findByNfe(nota.id)

  if (produtos.length === 0) erros = appendLine(erros, 'Favor adicionar os produtos da NFe!')

  if (produtos.some(p => !p.stNfe)) erros = appendLine(erros, 'Verifique a tributação dos produtos!!')

  const totalProdutos = produtos.reduce((acc, item) => acc + parseFloat(item.quantidade) * parseFloat(item.unitario), 0)
  if (totalProdutos === 0 && !nota.complementar) erros = appendLine(erros, 'Produto com valor zerado!')
  const items = produtos.reduce((acc, item) => acc + parseFloat(item.quantidade), 0)
  const totalNota =
    totalProdutos - parseFloat('' + nota.desconto) + parseFloat('' + nota.frete) + parseFloat('' + nota.outrasDespesas)
  // // Transportador
  // if (nota.transpNome) {
  //  console.log('entrou transp')

  //  if (data.transp) {
  // updateNota.Transportador = transportador.id
  // updateNota.tipofrete = 0
  //    console.log(data.transp)
  //    if (data.transp.cpfCnpj) updateNota.TranspCPFCNPJ = data.transp.cpfCnpj.trim()

  // if (transportador.) updateNota.TranspRGIE = transportador.rgIe.trim()

  //    if (data.transp.address) updateNota.Transpendereco = data.transp.address.trim()

  //    if (data.transp.city) updateNota.Transpcidade = data.transp.city.trim()

  //    if (data.transp.state) updateNota.Transpestado = data.transp.state.trim()

  //     if (data.ufTransp) updateNota.Veiculoestado = data.ufTransp.trim()

  //     if (data.placaTransp) updateNota.VeiculoPlaca = data.placaTransp.trim()
  //   }
  // }

  if (!nota.volumes || Number(nota.volumes) < 0) updateNota.Volumes = 1

  if (!nota.especie) updateNota.especie = 'Vol'

  if (+nota.pesoBruto < 0)
    erros = appendLine(erros, 'O peso bruto deve ser informado de forma numérica maior ou igual a zero!')

  if (+nota.pesoLiquido < 0)
    erros = appendLine(erros, 'O peso liquído deve ser informado de forma numérica maior ou igual a zero!')

  if (+nota.frete < 0) erros = appendLine(erros, 'O frete deve ser informado de forma numérica maior ou igual a zero!')

  if (+nota.frete < 0) erros = appendLine(erros, 'O seguro deve ser informado de forma numérica maior ou igual a zero!')

  if (+nota.outrasDespesas < 0)
    erros = appendLine(erros, 'As outras despesas devem ser informadas de forma numérica maior ou igual a zero!')

  if (+nota.freteOutros < 0)
    erros = appendLine(erros, 'O frete outros deve ser informado de forma numérica maior ou igual a zero!!')

  if (+nota.desconto < 0) erros = appendLine(erros, 'desconto não deve ser informado de forma negativa!')

  updateNota.totalDinheiro = nota.totalDinheiro
  updateNota.totalCheque = nota.totalCheque
  updateNota.totalCartaoCredito = nota.totalCartaoCredito
  updateNota.totalCartaoDebito = nota.totalCartaoDebito
  updateNota.totalOutros = nota.totalOutros

  const totalPagamentos =
    updateNota.totalDinheiro +
    updateNota.totalCheque +
    updateNota.totalCartaoDebito +
    updateNota.totalCartaoCredito +
    updateNota.TotalBoleto +
    updateNota.totalOutros

  if (Math.abs(totalNota - totalPagamentos) > 0.001) {
    erros = appendLine(erros, 'Soma das formas de pagamento é divergente do total')
  } else {
    updateNota.totalNota = parseFloat('' + totalNota)
    updateNota.totalProduto = parseFloat(totalProdutos.toFixed(2))
    updateNota.status = 'Validado'
    updateNota.qtdePagina = parseFloat((produtos.length / 19 + 1).toFixed(0))
    updateNota.qtdeItens = +items
    updateNota.qtdeProdutos = produtos.length
    updateNota.baseICMS = 0
    updateNota.valorICMS = 0
    updateNota.valorTributo = 0
  }
  if (!nota.dataSaida) updateNota.dataSaida = addMinutes(nota.data, 30)

  let operacaoNFe = OperacaoNFe.Mesmoestado

  if (nota.estado !== 'EX' && nota.estado !== parameters.nfeUf) {
    operacaoNFe = OperacaoNFe.Interestadual
  } else if (nota.estado === 'EX') {
    operacaoNFe = OperacaoNFe.Internacional
  }

  updateNota.pesoBruto = 0
  updateNota.pesoLiquido = 0
  // let totalProdArred = 0
  for (const produto of produtos) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProduto: any = {}
    const stProduto = await taxSituationsRepository.findById(produto.stNfe)

    /* a Integrado que ira mandar o cfop corretamente
      if (
        operacaoNFe === OperacaoNFe.Interestadual &&
        nota.tipo === 'SAIDA' &&
        produto.cfop === '6.102'
      ) {
        if (
          nota.CPF_CNPJ.length > 11 &&
          (nota.RG_IE || '').toLowerCase().startsWith('isent')
        )
          updateProduto.cfop = '6.108'
        else if (nota.CPF_CNPJ.length <= 11) updateProduto.cfop = '6.108'
        else updateProduto.cfop = cfopChange(produto.cfop, nota.tipo, operacaoNFe)
      } else updateProduto.cfop = cfopChange(produto.cfop, nota.tipo, operacaoNFe) */

    updateProduto.cfop = cfopChange(produto.cfop, nota.tipo, operacaoNFe)
    if (!stProduto) {
      erros = appendLine(erros, 'Verifique a tributação dos produtos!')
      break
    } else {
      const totalProd = +(produto.unitario * produto.quantidade)
      // updateProduto.unitario = produto.unitario.toFixed(2)
      // totalProdArred =
      //  totalProdArred + parseFloat((produto.unitario * produto.quantidade).toFixed(2))
      const aliquotaBaseTributo = await getAliquotaTributo(produto.ncm)
      if (totalProd === 0 && !nota.complementar) erros = appendLine(erros, 'Produto com valor zerado!')
      updateProduto.aliquotaICMS = stProduto.aliquotaIcms
      updateProduto.baseICMS = totalProd
      updateProduto.valorICMS = (totalProd * produto.aliquotaICMS) / 100
      updateProduto.st = stProduto.cst
      updateProduto.cf = 0
      updateProduto.baseTributo = +((aliquotaBaseTributo * totalProd) / 100).toFixed(2)
      if (produto.st === 500 || produto.st === 6 || produto.st === 60)
        updateProduto.cest = await getCESTByNCM(produto.ncm)

      updateNota.baseICMS += updateProduto.baseICMS
      updateNota.valorICMS += updateProduto.valorICMS
      updateNota.valorTributo += updateProduto.baseTributo
    }
    console.log(updateNota)
    console.log(updateProduto)
    await nfeProductsRepository.update({ ...updateProduto, id: produto.id })
  }
  if (erros) {
    updateNota.erros = erros
    updateNota.status = 'Erro'
  }

  if (!nota.dataOrigem) updateNota.dataOrigem = nota.data
  await nfeRepository.update({ id: nota.id, ...updateNota })
}
