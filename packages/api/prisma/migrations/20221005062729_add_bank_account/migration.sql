-- AlterTable
ALTER TABLE "installment" ADD COLUMN     "bankAccountId" UUID,
ADD COLUMN     "bankSlip" BOOLEAN;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
