export function getStateFundoPobreza(state: string) {
  switch (state) {
    case 'AL':
      return 1

    case 'RJ':
      return 2

    case 'MT':
      return 2

    case 'SP':
      return 2
    default:
      return 0
  }
}
