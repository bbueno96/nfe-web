-- DropForeignKey
ALTER TABLE "account_payable" DROP CONSTRAINT "account_payable_accountPaymentId_fkey";

-- DropForeignKey
ALTER TABLE "account_payable" DROP CONSTRAINT "account_payable_providerId_fkey";

-- AlterTable
ALTER TABLE "account_payable" ALTER COLUMN "accountPaymentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "account_payable" ADD CONSTRAINT "account_payable_accountPaymentId_fkey" FOREIGN KEY ("accountPaymentId") REFERENCES "account_payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
