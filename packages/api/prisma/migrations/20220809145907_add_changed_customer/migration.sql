-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_customerId_fkey";

-- DropForeignKey
ALTER TABLE "installment" DROP CONSTRAINT "installment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "customerApoioId" UUID,
ADD COLUMN     "customerApoioName" VARCHAR(250),
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "installment" ADD COLUMN     "customerApoioId" UUID,
ADD COLUMN     "customerApoioName" VARCHAR(250),
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "customerApoioId" UUID,
ADD COLUMN     "customerApoioName" VARCHAR(250),
ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
