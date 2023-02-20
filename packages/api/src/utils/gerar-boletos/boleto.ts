export function bankSlipSicredi(
  Bancos,
  customer,
  parameter,
  banckAccount,
  GeradorDeDigitoPadrao,
  nossoNumero,
  installment,
) {
  const nossoNumeroDigito = GeradorDeDigitoPadrao.mod11(
    nossoNumero,
    [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  )

  const boleto = {
    banco: new Bancos[banckAccount.institution](),
    pagador: {
      nome: customer.name,
      RegistroNacional: customer.cpfCnpj,
      endereco: {
        logradouro: customer.address,
        bairro: customer.province,
        cidade: customer.cityId,
        estadoUF: customer.state,
        cep: customer.postalCode,
      },
    },
    instrucoes: ['Após o vencimento Mora dia R$ 0,03', 'Após o vencimento, multa de 2%'],
    beneficiario: {
      nome: parameter.nfeRazao,
      cnpj: parameter.nfeCnpj,
      dadosBancarios: {
        carteira: banckAccount.wallet,
        agencia: `${banckAccount.agency}24`.padStart(6, '0'),
        agenciaDigito: '5',
        conta: `${banckAccount.number}`.padStart(5, '0'),
        contaDigito: banckAccount.verifyingDigit,
        nossoNumero: `${banckAccount.ourNumber}`.padStart(5, '0'),
        nossoNumeroDigito: nossoNumeroDigito > 9 ? 0 : nossoNumeroDigito,
        // posto: "02",748989195000001000011000831000728240034269103748989195000001000011000831000728240034269103
        // posto: "02",748989195000001000011000831000728240034269103748989195000001000011000831000728240034269103
        // beneficiario: "00623",
      },
      endereco: {
        logradouro: parameter.nfeLagradouro,
        bairro: parameter.nfeBairro,
        cidade: parameter.nfeCidade,
        estadoUF: parameter.nfeUf,
        cep: parameter.nfeCep,
      },
    },
    boleto: {
      numeroDocumento: installment.numeroDoc,
      especieDocumento: 'DM',
      valor: installment.value,
      datas: {
        vencimento: installment.dueDate,
        processamento: new Date(),
        documentos: new Date(),
      },
    },
  }
  return boleto
}

export function bankSlipBrasil(
  Bancos,
  customer,
  parameter,
  banckAccount,
  GeradorDeDigitoPadrao,
  nossoNumero,
  installment,
) {
  const boleto = {
    banco: new Bancos.BancoBrasil(),
    pagador: {
      nome: customer.name,
      RegistroNacional: customer.cpfCnpj,
      endereco: {
        logradouro: customer.address,
        bairro: customer.province,
        cidade: customer.cityId,
        estadoUF: customer.state,
        cep: customer.postalCode,
      },
    },
    instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
    beneficiario: {
      nome: parameter.nfeRazao,
      cnpj: parameter.nfeCnpj,
      dadosBancarios: {
        carteira: `${banckAccount.wallet}`.padStart(2, '0'),
        agencia: `${banckAccount.agency}`.padStart(5, '0'),
        agenciaDigito: '0',
        conta: `${banckAccount.number}`.padStart(7, '0'),
        contaDigito: banckAccount.verifyingDigit,
        nossoNumero: '05009401448',
        nossoNumeroDigito: GeradorDeDigitoPadrao.mod11(
          '0500' + `${9401448}`.padStart(7, '0'),
          [7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9],
        ),
        // posto: "02",
        // beneficiario: "00623",
      },
      endereco: {
        logradouro: parameter.nfeLagradouro,
        bairro: parameter.nfeBairro,
        cidade: parameter.nfeCidade,
        estadoUF: parameter.nfeUf,
        cep: parameter.nfeCep,
      },
    },
    boleto: {
      numeroDocumento: installment.numeroDoc,
      especieDocumento: 'DM',
      valor: installment.value,
      datas: {
        vencimento: installment.dueDate,
        processamento: new Date(),
        documentos: new Date(),
      },
    },
  }

  return boleto
}
export function bankSlipBradesco(
  Bancos,
  customer,
  parameter,
  banckAccount,
  GeradorDeDigitoPadrao,
  nossoNumero,
  installment,
) {
  const boleto = {
    banco: new Bancos.Bradesco(),
    pagador: {
      nome: customer.name,
      RegistroNacional: customer.cpfCnpj,
      endereco: {
        logradouro: customer.address,
        bairro: customer.province,
        cidade: customer.cityId,
        estadoUF: customer.state,
        cep: customer.postalCode,
      },
    },
    instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
    beneficiario: {
      nome: parameter.nfeRazao,
      cnpj: parameter.nfeCnpj,
      dadosBancarios: {
        carteira: `${banckAccount.wallet}`.padStart(2, '0'),
        agencia: `${banckAccount.agency}`.padStart(4, '0'),
        agenciaDigito: '0',
        conta: `${banckAccount.number}`.padStart(7, '0'),
        contaDigito: banckAccount.verifyingDigit,
        nossoNumero,
        nossoNumeroDigito: GeradorDeDigitoPadrao.geraDigitoBradesco(
          `${banckAccount.wallet}`.padStart(2, '0') + `${nossoNumero}`.padStart(11, '0'),
          [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2],
        ),
        // posto: "02",
        // beneficiario: "00623",
      },
      endereco: {
        logradouro: parameter.nfeLagradouro,
        bairro: parameter.nfeBairro,
        cidade: parameter.nfeCidade,
        estadoUF: parameter.nfeUf,
        cep: parameter.nfeCep,
      },
    },
    boleto: {
      numeroDocumento: installment.numeroDoc,
      especieDocumento: 'DM',
      valor: installment.value,
      datas: {
        vencimento: installment.dueDate,
        processamento: new Date(),
        documentos: new Date(),
      },
    },
  }

  return boleto
}
