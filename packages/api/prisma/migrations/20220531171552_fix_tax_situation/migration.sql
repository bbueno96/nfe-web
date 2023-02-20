/*
  Warnings:

  - You are about to drop the column `csosn` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `cst` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group" DROP COLUMN "csosn",
DROP COLUMN "cst",
DROP COLUMN "rate";

-- AlterTable
ALTER TABLE "tax_situation" ADD COLUMN     "csosn" VARCHAR(3),
ADD COLUMN     "cst" VARCHAR(2),
ADD COLUMN     "rate" DECIMAL(3,2);
