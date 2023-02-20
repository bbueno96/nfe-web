-- DropIndex
DROP INDEX "provider_cpfCnpj_key";

-- CreateTable
CREATE TABLE "stock_product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "amount" DECIMAL(10,4) NOT NULL,
    "type" VARCHAR(1),
    "generateId" UUID,
    "numeroDoc" VARCHAR(250),
    "number" INTEGER,
    "typeGenerate" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" UUID NOT NULL,
    "companyId" UUID,

    CONSTRAINT "stock_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_product" ADD CONSTRAINT "stock_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
