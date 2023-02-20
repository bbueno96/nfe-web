-- AlterTable
ALTER TABLE "nfe" ADD COLUMN     "paymentMethodId" UUID;

-- CreateTable
CREATE TABLE "installment" (
    "id" UUID NOT NULL,
    "numeroDoc" VARCHAR(250),
    "customerId" UUID NOT NULL,
    "numberInstallment" INTEGER NOT NULL,
    "dueDate" TIMESTAMPTZ NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "value" DECIMAL(10,4),
    "fine" DECIMAL(10,4),
    "interest" DECIMAL(10,4),
    "nfeId" UUID,
    "paymentMethodId" UUID,
    "ourNumber" INTEGER,
    "digitableLine" VARCHAR(250),
    "checkNumber" VARCHAR(250),
    "checkDueDate" TIMESTAMPTZ,
    "checkCpfCnpj" VARCHAR(14),
    "checkName" VARCHAR(14),
    "checkAgency" INTEGER,
    "checkAccount" INTEGER,
    "companyId" UUID,

    CONSTRAINT "installment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nfe" ADD CONSTRAINT "nfe_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "pay_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_nfeId_fkey" FOREIGN KEY ("nfeId") REFERENCES "nfe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "pay_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;
