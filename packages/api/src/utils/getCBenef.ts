export function getCBenef(st: number) {
  if (process.env.NFE_UF !== 'PR') {
    return ''
  }

  switch (st) {
    case 300:
      return 'PR800000'

    case 30:
    case 40:
    case 400:
      return 'PR810000'

    case 20:
      return 'PR820000'

    case 50:
      return 'PR840000'

    case 51:
      return 'PR830000'

    case 41:
      return 'PR800001'

    default:
      return ''
  }
}
