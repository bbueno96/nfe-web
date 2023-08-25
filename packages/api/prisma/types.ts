import { PrismaClient, Prisma } from '@prisma/client'

export type PrismaTransaction = Omit<
  PrismaClient,
  '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
>

export type PrismaEntity<T> = {
  [K in keyof T]: T[K] extends Prisma.Decimal
    ? Prisma.Decimal | number
    : T[K] extends Prisma.Decimal | undefined
    ? Prisma.Decimal | number | undefined
    : T[K] extends Prisma.Decimal | null | undefined
    ? Prisma.Decimal | number | null | undefined
    : T[K]
}
