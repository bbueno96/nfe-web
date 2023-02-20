/*
  Warnings:

  - You are about to drop the column `codNota` on the `nfe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nfe" DROP COLUMN "codNota",
ADD COLUMN     "chave" VARCHAR(150);

-- AlterTable
ALTER TABLE "parameter" ADD COLUMN     "serie" INTEGER;
