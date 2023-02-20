-- AlterTable
ALTER TABLE "pay_method" ADD COLUMN     "bankAccountId" UUID;

-- AddForeignKey
ALTER TABLE "pay_method" ADD CONSTRAINT "pay_method_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
