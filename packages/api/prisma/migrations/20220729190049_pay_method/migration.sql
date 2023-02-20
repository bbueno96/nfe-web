-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "payMethodId" UUID;

-- CreateTable
CREATE TABLE "pay_method" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(250) NOT NULL,
    "fine" DECIMAL(10,4),
    "interest" DECIMAL(10,4),
    "dueDay" INTEGER NOT NULL,
    "numberInstallments" INTEGER NOT NULL,
    "bankSlip" BOOLEAN NOT NULL DEFAULT false,
    "wallet" INTEGER,
    "ourNumber" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disableAt" TIMESTAMPTZ,
    "companyId" UUID,

    CONSTRAINT "pay_method_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_payMethodId_fkey" FOREIGN KEY ("payMethodId") REFERENCES "pay_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;
