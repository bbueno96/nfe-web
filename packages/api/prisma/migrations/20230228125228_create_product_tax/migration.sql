-- AlterTable
ALTER TABLE "nfe_produto" ADD COLUMN     "producttax" UUID;

-- CreateTable
CREATE TABLE "product_tax" (
    "id" UUID NOT NULL,
    "product" UUID NOT NULL,
    "aliquotaIcms" DECIMAL(10,2),
    "cst" INTEGER,
    "baseIcms" DECIMAL(10,2) DEFAULT 100,
    "simplesNacional" BOOLEAN NOT NULL DEFAULT false,
    "aliquotaIcmsSt" DECIMAL(10,2),
    "baseIcmsSt" DECIMAL(10,2),
    "ipi" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cfop" VARCHAR(5) NOT NULL,
    "cstPis" VARCHAR(8),
    "alqPis" DECIMAL(10,4),
    "cstCofins" VARCHAR(8),
    "alqCofins" DECIMAL(10,4),

    CONSTRAINT "product_tax_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_tax" ADD CONSTRAINT "product_tax_product_fkey" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_produto" ADD CONSTRAINT "nfe_produto_producttax_fkey" FOREIGN KEY ("producttax") REFERENCES "product_tax"("id") ON DELETE SET NULL ON UPDATE CASCADE;
