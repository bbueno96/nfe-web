import { OperacaoNFe } from './nfe/validation'

export function cfopChange(cfopOriginal: string, tipoNfe: string, operacao: OperacaoNFe) {
  let digit = ''
  switch (operacao) {
    case OperacaoNFe.Mesmoestado:
      digit = tipoNfe !== 'ENTRADA' ? '5' : '1'
      break

    case OperacaoNFe.Interestadual:
      digit = tipoNfe !== 'ENTRADA' ? '6' : '2'
      break

    case OperacaoNFe.Internacional:
      digit = tipoNfe !== 'ENTRADA' ? '7' : '3'
      break
  }

  return digit + cfopOriginal.substring(1, cfopOriginal.length)
}
