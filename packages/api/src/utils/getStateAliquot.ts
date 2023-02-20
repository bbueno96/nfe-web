export function getStateAliquot(state: string): number {
  switch (state) {
    case 'AC':
    case 'ES':
    case 'GO':
    case 'MT':
    case 'MS':
    case 'PA':
    case 'RR':
    case 'SC':
      return 17

    case 'RO':
      return 17.5

    case 'RJ':
      return 20

    default:
      return 18
  }
}
