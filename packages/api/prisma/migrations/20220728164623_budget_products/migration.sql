-- CreateTable
CREATE TABLE "budget_products" (
    "id" UUID NOT NULL,
    "budgetId" UUID,
    "productId" UUID,
    "amount" DECIMAL(10,4),
    "unitary" DECIMAL(10,4),
    "total" DECIMAL(10,4),
    "companyId" UUID,

    CONSTRAINT "budget_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget_products" ADD CONSTRAINT "budget_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_products" ADD CONSTRAINT "budget_products_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
