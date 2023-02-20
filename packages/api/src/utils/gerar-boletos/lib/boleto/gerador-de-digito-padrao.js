const ArrayUtils = require('../utils/array-utils')
const MathUtils = require('../utils/math-utils')
const series = ArrayUtils.series
const mod = MathUtils.mod

module.exports.mod10 = function (campo) {
  const digito = mod({
    value: campo,
    factors: [2, 1],
    divider: 10,
    direction: 'rightToLeft',
    cumplimentaryToDivider: true,
    reduceSummationTerms: true,
  })

  return digito === 10 ? 0 : digito
}

module.exports.mod11 = function (codigoDeBarras, substituicoes) {
  if (!substituicoes) {
    substituicoes = {
      de: [0, 1, 10, 11],
      para: 1,
    }
  }

  if (!Array.isArray(substituicoes.de)) {
    substituicoes.de = [substituicoes.de]
  }

  let digito = mod({
    value: codigoDeBarras,
    factors: series(2, 9),
    cumplimentaryToDivider: true,
  })

  if (substituicoes.de.indexOf(digito) !== -1) {
    digito = substituicoes.para
  }

  return digito
}

module.exports.geraDigitoBradesco = function (nossoNumero, substituicoes) {
  let soma = 0

  for (let i = 0; i < nossoNumero.length; i++) {
    if (parseInt(nossoNumero[i]) !== 0) {
      soma += substituicoes[i] * parseInt(nossoNumero[i])
    }
  }
  let digito = soma % 11
  if (digito === 1 || digito === 0) {
    digito = 'P'
  } else {
    digito = 11 - digito
  }
  return digito
}
