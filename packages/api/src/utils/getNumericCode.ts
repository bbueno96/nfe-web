export function getNumericCode(length = 8): string {
  const numbers = []

  for (let index = 0; index < length; index++) {
    numbers.push(Math.floor(Math.random() * 10))
  }

  return numbers.join('')
}
