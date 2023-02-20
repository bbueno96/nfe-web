/*
  Warnings:

  - You are about to drop the `provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "nfe" DROP CONSTRAINT "nfe_fornecedor_fkey";

-- DropTable
DROP TABLE "provider";
