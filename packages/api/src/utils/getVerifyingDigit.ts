export function getVerifyingDigit(key: string) {
  let weight = 2
  let sum = 0

  key
    .replace(/\D/g, '')
    .substr(0, 43)
    .split('')
    .reverse()
    .forEach(digit => {
      sum += parseInt(digit, 10) * weight
      weight += 1

      if (weight > 9) {
        weight = 2
      }
    })

  const rest = sum % 11

  if (rest === 0 || rest === 1) return 0
  return 11 - rest
}
