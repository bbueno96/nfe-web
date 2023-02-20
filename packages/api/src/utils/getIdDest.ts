const IdDest = {
  External: 3,
  Interstate: 2,
  Internal: 1,
}

export function getIdDest(cfop: string, ufNota: string, isExternal: boolean, ufParameter: string) {
  if (isExternal) {
    return IdDest.External
  }

  if (cfop === '2.102' || ufParameter !== ufNota) {
    return IdDest.Interstate
  }

  return IdDest.Internal
}
