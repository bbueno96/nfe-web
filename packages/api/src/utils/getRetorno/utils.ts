import fs from 'fs'
import yaml from 'js-yaml'
import pad from 'pad'

export function makeLine(layout: any, data: any) {
  const object: any = {}
  if (layout) {
    const index = 0
    Object.keys(layout).forEach(key => {
      const item = layout[key]
      if (item.pos) {
        const start = item.pos[0] - 1 // yml começa no 1 e array em 0
        const length = item.pos[1] - item.pos[0] + 1
        if (data) {
          object[key] = data.substr(start, length) || item.default
        } else {
          console.warn('Nao tem data', data)
        }
      } else {
        console.warn('Nao tem posicao pra key', key)
      }
    })
  }
  return object
}

/*
 * Alfanumérico (picture X): alinhados à esquerda com brancos à direita. Preferencialmente,
 * todos os caracteres devem ser maiúsculos. Aconselhase a não utilização de
 * caracteres especiais (ex.: “Ç”, “?”,, etc) e
 * acentuação gráfica (ex.: “Á”, “É”, “Ê”, etc) e os campos não utiliza dos deverão ser preenchidos com brancos.
 * */
const formatText = function (value: any, size: any) {
  return pad(value.slice(0, size), size, ' ')
}

/*  Numérico (picture 9): alinhado à direita com zeros à esquerda e os campos não utilizados deverão ser preenchidos
 * com zeros. - Vírgula assumida (picture V): indica a posição da vírgula dentro de um campo numérico.
 * Exemplo: num campo com picture “9(5)V9(2)”, o número “876,54” será representado por “0087654”
 * @param {*} picture
 * @param {*} value
 */
const formatNumber = function (value: any, size: any) {
  while (value.length < size) {
    value = '0' + value
  }
  return value
}

const formatDate = function (value: any, size: any, dateFormat: any) {
  switch (dateFormat) {
    case '%d%m%Y':
      value = value.slice(0, 8)
      break
    case '%d%m%y':
      value = value.slice(0, 4) + value.slice(6, 8)
      break

    case '%H%M%S':
      value = value.slice(0, 8)
      break

    default:
      throw new Error('dateFormat inválido: ' + dateFormat)
  }

  while (value.length < size) {
    value = '0' + value
  }

  return value
}

export function formatCurrency(value = 0, integer = 0, decimal = 0) {
  value = Number(value)
  if (typeof value !== 'number') {
    throw new Error('formatCurrency: ' + value + integer + decimal)
  }

  //  Efetua o arredondamento
  const vals = value.toFixed(decimal).split('.')
  vals[1] = vals[1] || ''

  //  Limita os caracteres
  vals[0] = pad(Number(integer), vals[0].toString().slice(0, integer), '0')
  vals[1] = pad(vals[1].toString().slice(0, decimal), Number(decimal), '0')

  return vals.join('')
}

export function readYaml(filename: string) {
  console.log(filename)
  return yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
}
