/*
  Warnings:

  - You are about to drop the column `alqCofins` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `alqPis` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `cfop` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `cstCofins` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `cstPis` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `ipi` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `pisCofins` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `st` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_st_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "alqCofins",
DROP COLUMN "alqPis",
DROP COLUMN "cfop",
DROP COLUMN "cstCofins",
DROP COLUMN "cstPis",
DROP COLUMN "ipi",
DROP COLUMN "pisCofins",
DROP COLUMN "st";
