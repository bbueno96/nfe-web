/*
  Warnings:

  - Made the column `cfop` on table `nfe_produto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "nfe_produto" ALTER COLUMN "cfop" SET NOT NULL,
ALTER COLUMN "cfop" SET DATA TYPE VARCHAR(150);
