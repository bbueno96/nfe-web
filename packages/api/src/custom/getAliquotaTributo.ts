import { Prisma } from '@prisma/client'

import { TaxSituationsRepository } from '../repositories/TaxSituationsRepository'

export async function getAliquotaTributo(NCM: string): Promise<Prisma.Decimal> {
  const taxSituationsRepository = new TaxSituationsRepository()
  let aliquotas = await taxSituationsRepository.findIbptByNcm(NCM)

  if (!aliquotas) {
    aliquotas = await taxSituationsRepository.findIbptByNcm('49019900')
  }

  const sumAliquota = aliquotas?.AliqNac?.add(aliquotas?.AliqEst || 0).add(aliquotas?.AliqMun || 0)

  return new Prisma.Decimal(sumAliquota || 0)
}
