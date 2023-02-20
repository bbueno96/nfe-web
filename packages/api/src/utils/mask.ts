import { isCnpj } from './cpfCnpj'

export const placeholderChar = '_'
export const CnpjMask = [
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
]

export const CpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]

export const CellPhoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

export const PhoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

export const CepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]

export const DecimalConfig = {
  decimalSeparator: ',',
  precision: 2,
  prefix: '',
  selectAllOnFocus: true,
  thousandSeparator: '.',
}

export const zip = (first, second) => first.map((f, i) => [f, second[i]])

export const convertMaskToPlaceholder = (mask = []) =>
  mask.map(char => (char instanceof RegExp ? placeholderChar : char)).join('')

export const conformToMask = config => {
  const { value = '', previousValue, mask, placeholder, caretPosition } = config

  const editDistance = value.length - previousValue.length
  const isAddition = editDistance > 0
  const startIndex = caretPosition + (isAddition ? -editDistance : 0)

  const valueArr = value.split('').filter((char, i) => {
    const shouldOffset = i >= startIndex && previousValue.length === mask.length

    return !(char !== placeholderChar && char === placeholder[shouldOffset ? i - editDistance : i])
  })

  let counter = 0

  const maskMapper = (pch, currentMask) => {
    const ch = valueArr[counter]
    const isEditable = pch === placeholderChar && !!ch
    const isValidChar = ch !== placeholderChar && currentMask instanceof RegExp && currentMask.test(ch)

    if (isEditable || isValidChar) {
      counter += 1
    }

    if (isEditable && isValidChar) {
      return ch
    }

    return isEditable ? maskMapper(pch, currentMask) : pch
  }

  return zip(placeholder.split(''), mask)
    .map(([pch, cm]) => maskMapper(pch, cm))
    .join('')
}

export const applyMask = (mask, value) => {
  if (value === '') return ''

  return conformToMask({
    caretPosition: value.length - 1,
    mask,
    placeholder: convertMaskToPlaceholder(mask),
    previousValue: '',
    value,
  })
}

export const maskCpfCnpj = cpfcnpj => (isCnpj(cpfcnpj) ? applyMask(CnpjMask, cpfcnpj) : applyMask(CpfMask, cpfcnpj))
export const maskCellPhone = phone =>
  phone.length > 10 ? applyMask(CellPhoneMask, phone) : applyMask(PhoneMask, phone)
export const maskPostalCode = postalCode => applyMask(CepMask, postalCode)

export function maskDecimal(value, precision = 2) {
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  if (precision === 0) {
    return formatted.split(',').join('.')
  }

  const [int, fract = '0'] = formatted.split('.')

  return `${int.split(',').join('.')},${fract}`
}
