-- AlterTable
ALTER TABLE "bank_account" ADD COLUMN     "sequenceLot" INTEGER;

-- AlterTable
ALTER TABLE "installment" ADD COLUMN     "BankRemittanceId" UUID,
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "bank_remittance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "numberLot" INTEGER,
    "conteudo" TEXT,
    "companyId" UUID,

    CONSTRAINT "bank_remittance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_BankRemittanceId_fkey" FOREIGN KEY ("BankRemittanceId") REFERENCES "bank_remittance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
