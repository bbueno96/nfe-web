import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Ibpt {
  id: string
  NCM_NBS?: string | null
  Ex?: string | null
  Descricao?: string | null
  UTrib?: string | null
  AliqNac?: Prisma.Decimal | null
  AliqImp?: Prisma.Decimal | null
  AliqEst?: Prisma.Decimal | null
  AliqMun?: Prisma.Decimal | null

  constructor(props: Omit<Ibpt, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.NCM_NBS = props.NCM_NBS
    this.Ex = props.Ex
    this.Descricao = props.Descricao
    this.UTrib = props.UTrib
    this.AliqNac = new Prisma.Decimal(props.AliqNac || 0)
    this.AliqImp = new Prisma.Decimal(props.AliqImp || 0)
    this.AliqEst = new Prisma.Decimal(props.AliqEst || 0)
    this.AliqMun = new Prisma.Decimal(props.AliqMun || 0)
  }
}

export { Ibpt }
