-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "numberOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER,
    "discount" DECIMAL(10,4),
    "total" DECIMAL(10,4) NOT NULL,
    "customerId" UUID NOT NULL,
    "shipping" DECIMAL(10,4),
    "employeeId" UUID NOT NULL,
    "companyId" UUID,
    "payMethodId" UUID,
    "obs" VARCHAR(250),
    "budgetId" UUID,
    "disabledAt" TIMESTAMPTZ,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_products" (
    "id" UUID NOT NULL,
    "orderId" UUID,
    "productId" UUID,
    "amount" DECIMAL(10,4),
    "unitary" DECIMAL(10,4),
    "total" DECIMAL(10,4),
    "companyId" UUID,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_payMethodId_fkey" FOREIGN KEY ("payMethodId") REFERENCES "pay_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
