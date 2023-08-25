export function getICMS(cf: number, st: number, vb: number, aliq: number, vicm: number) {
  const orig = cf

  if (st === 100) {
    return { ICMS00: { orig, modBC: 3, CST: '00' } }
  }

  if (st === 0) {
    return {
      ICMS00: { orig, CST: '00', modBC: 2, vBC: vb?.toFixed(2), pICMS: aliq?.toFixed(4), vICMS: vicm?.toFixed(2) },
    }
  }

  if ([1, 10].includes(st)) {
    return { ICMS10: { orig, CST: 10 } }
  }

  if ([2, 20].includes(st)) {
    return { ICMS20: { orig, CST: 20 } }
  }

  if ([3, 30].includes(st)) {
    return { ICMS30: { orig, CST: 30 } }
  }

  if ([4, 40].includes(st)) {
    return { ICMS40: { orig, CST: 40 } }
  }

  if (st === 41) {
    return { ICMS40: { orig, CST: 41 } }
  }

  if ([5, 50].includes(st)) {
    return { ICMS40: { orig, CST: 50 } }
  }

  if (st === 51) {
    return { ICMS51: { orig, CST: 51 } }
  }

  if ([6, 60].includes(st)) {
    return { ICMS60: { orig, CST: 60 } }
  }

  if ([7, 70].includes(st)) {
    return { ICMS70: { orig, CST: 70 } }
  }

  if ([9, 90].includes(st)) {
    return { ICMS90: { orig, CST: 90 } }
  }

  if (st === 101) {
    return { ICMSSN101: { orig, CSOSN: 101 } }
  }

  if ([102, 103, 300, 400].includes(st)) {
    return { ICMSSN102: { orig, CSOSN: 102 } }
  }

  if (st === 201) {
    return { ICMSSN201: { orig, CSOSN: 201 } }
  }

  if ([202, 203].includes(st)) {
    return { ICMSSN202: { orig, CSOSN: 202 } }
  }

  if (st === 500) {
    return { ICMSSN500: { orig, CSOSN: 500 } }
  }

  if (st === 900) {
    return { ICMSSN900: { orig, CSOSN: 900 } }
  }
}
