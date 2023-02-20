/*
  Warnings:

  - The `cst` column on the `tax_situation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tax_situation" DROP COLUMN "cst",
ADD COLUMN     "cst" INTEGER;
