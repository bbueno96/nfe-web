/*
  Warnings:

  - You are about to drop the column `ourNumber` on the `pay_method` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_account" ADD COLUMN     "ourNumber" INTEGER;

-- AlterTable
ALTER TABLE "installment" ALTER COLUMN "ourNumber" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "pay_method" DROP COLUMN "ourNumber";
