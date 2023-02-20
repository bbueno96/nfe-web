/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-unused-expressions */

const BoletoStringify = require('../stringify/boletoStringify')
const Boleto = require('../utils/functions/boletoUtils')

module.exports = class Boletos {
  constructor({ banco, pagador, boleto, beneficiario, instrucoes }) {
    this.banco = banco
    this.pagador = pagador
    this.boleto = boleto
    this.beneficiario = beneficiario
    this.instrucoes = instrucoes
    this.boletoInfo
  }

  gerarBoleto() {
    const dataInstance = Boleto.Datas
    const { datas, valor, especieDocumento, numeroDocumento } = this.boleto

    this.boletoInfo = Boleto.Boleto.novoBoleto()
      .comDatas(
        dataInstance
          .novasDatas()
          .comVencimento(datas.vencimento)
          .comProcessamento(datas.processamento)
          .comDocumento(datas.documentos),
      )
      .comBeneficiario(BoletoStringify.createBeneficiario(this.beneficiario))
      .comPagador(BoletoStringify.createPagador(this.pagador))
      .comBanco(this.banco)
      .comValorBoleto(parseFloat(valor).toFixed(2))
      .comNumeroDoDocumento(numeroDocumento)
      .comEspecieDocumento(especieDocumento)
      .comInstrucoes(BoletoStringify.createInstrucoes(this.instrucoes))
  }

  pdfFile() {
    return new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
    })
  }

  pdfStream(stream) {
    return new Promise(resolve =>
      new Boleto.Gerador(this.boletoInfo)
        .gerarPDF({
          creditos: '',
          stream,
        })
        .then(() => resolve({ boleto: this.boleto, stream })),
    )
  }
}
