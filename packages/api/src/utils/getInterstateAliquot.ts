export function getInterstateAliquot(from: string, to: string): number {
  const twelveStates = [
    'AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'PA',
    'PB',
    'PE',
    'PI',
    'RN',
    'RO',
    'RR',
    'SE',
    'TO',
  ]

  const sevenStates = ['MG', 'PR', 'RS', 'RJ', 'SC', 'SP']

  if (twelveStates.includes(from)) {
    return 12
  } else if (sevenStates.includes(from) && twelveStates.includes(to)) {
    return 7
  } else if (sevenStates.includes(from) && sevenStates.includes(to)) {
    return 12
  }

  return 0
}
