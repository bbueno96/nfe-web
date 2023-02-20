/*
  Warnings:

  - You are about to drop the column `wallet` on the `bank_slip_storege` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_remittance" ADD COLUMN     "wallet" INTEGER;

-- AlterTable
ALTER TABLE "bank_slip_storege" DROP COLUMN "wallet";
