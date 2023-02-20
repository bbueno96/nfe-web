-- AlterTable
ALTER TABLE "nfe" ADD COLUMN     "orderId" UUID;

-- AddForeignKey
ALTER TABLE "nfe" ADD CONSTRAINT "nfe_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
