-- CreateTable
CREATE TABLE "provider_products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID,
    "productIdProvider" VARCHAR(250),
    "providerId" UUID,
    "companyId" UUID,

    CONSTRAINT "provider_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "provider_products" ADD CONSTRAINT "provider_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_products" ADD CONSTRAINT "provider_products_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
