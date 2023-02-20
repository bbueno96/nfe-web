/*
  Warnings:

  - The `institution` column on the `bank_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bank_account" DROP COLUMN "institution",
ADD COLUMN     "institution" INTEGER;

-- CreateTable
CREATE TABLE "budget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "numberBudget" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "discount" DECIMAL(10,4),
    "total" DECIMAL(10,4) NOT NULL,
    "deliveryForecast" TIMESTAMPTZ,
    "custonerId" UUID NOT NULL,
    "shipping" DECIMAL(10,4),
    "employeeId" UUID NOT NULL,
    "companyId" UUID,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_custonerId_fkey" FOREIGN KEY ("custonerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
