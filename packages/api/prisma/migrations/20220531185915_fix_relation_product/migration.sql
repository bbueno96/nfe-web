-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_id_fkey";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "ipi" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "tax_situation" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brand_fkey" FOREIGN KEY ("brand") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
