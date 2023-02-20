import React from 'react'

import zip from 'lodash/zip'

import { onlyNumbers } from './format'
import { parseNumber } from './parse'
import { isCnpj } from './validate'

const placeholderChar = '_'
const getMask = mask => mask.split('').map(c => (c === '9' ? /\d/ : c))

export const conformToMask = config => {
  const { value = '', previousValue, placeholder, caretPosition } = config
  const mask = getMask(config.mask)
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
    const isEditable = pch === placeholderChar && ch
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

export const applyMask = (value, mask) =>
  value
    ? conformToMask({
        caretPosition: value.length - 1,
        mask,
        placeholder: getMask(mask)
          .map(char => (char instanceof RegExp ? placeholderChar : char))
          .join(''),
        previousValue: '',
        value,
      })
    : ''

export const adjustCaretPosition = props => {
  const { caretPosition, placeholder, previousValue, rawValue, value } = props

  if (caretPosition === 0) {
    return 0
  }

  if (rawValue === previousValue) {
    return caretPosition
  }

  const editLength = rawValue.length - previousValue.length
  const isAddition = editLength > 0
  const isMultiCharDelete = editLength > 1 && !isAddition && previousValue.length !== 0
  const hasRejectedChar = isAddition && (previousValue === value || value === placeholder)

  if (isMultiCharDelete) {
    return caretPosition
  }

  let startingSearchIndex = 0

  if (hasRejectedChar) {
    startingSearchIndex = caretPosition - editLength
  } else {
    const index = value.indexOf(placeholderChar)
    startingSearchIndex = index === -1 ? placeholder.length : index
  }

  if (isAddition) {
    return placeholder
      .split('')
      .findIndex((char, i) => i >= startingSearchIndex && (char === placeholderChar || i === placeholder.length))
  }

  for (let i = startingSearchIndex; i >= 0; i -= 1) {
    if (placeholder[i - 1] === placeholderChar || i === 0) {
      return i
    }
  }

  return 0
}

export function splitDecimal(value, precision = 2) {
  const num = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
  const [int, fract] = num.toString().split('.')

  return [parseNumber(int), parseNumber(fract)]
}

export function maskDecimal(value, precision = 2) {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  if (precision === 0) {
    return formatted.split(',').join('.')
  }

  const [int, fract = '0'] = formatted.split('.')

  return `${int.split(',').join('.')},${fract}`
}

export const maskMoney = value => `R$ ${maskDecimal(value)}`
export const tableMaskMoney = value => (
  <div className="flexTable">
    <div className="currency">R$</div>
    <div className="value">{maskDecimal(value)}</div>
  </div>
)

export const getPhoneMask = value => {
  const tel = onlyNumbers(value)
  return tel.length >= 3 && tel[2] === '9' ? '(99) 99999-9999' : '(99) 9999-9999'
}

export const getCpfCnpjMask = value => {
  const cpfCnpj = onlyNumbers(value)
  return cpfCnpj.length < 12 ? '999.999.999-99' : '99.999.999/9999-99'
}

export const maskCpfCnpj = cpfcnpj =>
  isCnpj(cpfcnpj) ? applyMask(cpfcnpj, '99.999.999/9999-99') : applyMask(cpfcnpj, '999.999.999-99')

export const maskCellPhone = phone => applyMask(phone, phone.length < 11 ? '(99) 9999-9999' : '(99) 99999-9999')

export const maskPostalCode = postalCode => applyMask(postalCode, '99999-999')
