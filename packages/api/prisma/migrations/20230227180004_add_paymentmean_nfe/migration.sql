-- AlterTable
ALTER TABLE "installment" ADD COLUMN     "installments" VARCHAR(250),
ADD COLUMN     "paymentMean" INTEGER;

-- AlterTable
ALTER TABLE "nfe" ADD COLUMN     "installments" VARCHAR(250),
ADD COLUMN     "paymentMean" INTEGER;
