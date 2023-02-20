-- CreateTable
CREATE TABLE "bank_slip_storege" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "installmentId" UUID,
    "conteudo" BYTEA,
    "companyId" UUID,

    CONSTRAINT "bank_slip_storege_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bank_slip_storege" ADD CONSTRAINT "bank_slip_storege_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "installment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
