-- AlterTable
ALTER TABLE "bank_remittance" ADD COLUMN     "bankAccountId" UUID;

-- AddForeignKey
ALTER TABLE "bank_remittance" ADD CONSTRAINT "bank_remittance_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
