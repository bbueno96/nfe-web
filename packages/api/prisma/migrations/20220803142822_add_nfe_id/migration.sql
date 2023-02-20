-- AlterTable
ALTER TABLE "bank_slip_storege" ADD COLUMN     "nfeId" UUID;

-- AddForeignKey
ALTER TABLE "bank_slip_storege" ADD CONSTRAINT "bank_slip_storege_nfeId_fkey" FOREIGN KEY ("nfeId") REFERENCES "nfe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
