-- CreateTable
CREATE TABLE "provider" (
    "id" UUID NOT NULL,
    "cpfCnpj" VARCHAR(14) NOT NULL,
    "stateInscription" VARCHAR(50),
    "name" VARCHAR(50) NOT NULL,
    "company" VARCHAR(100),
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "mobilePhone" VARCHAR(11) NOT NULL,
    "dateCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalEmails" VARCHAR(150),
    "address" VARCHAR(150) NOT NULL,
    "addressNumber" VARCHAR(20) NOT NULL,
    "complement" VARCHAR(50) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "postalCode" VARCHAR(8) NOT NULL,
    "cityId" INTEGER NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "disableAt" TIMESTAMPTZ,
    "observations" VARCHAR(250),
    "deliveryAddress" VARCHAR,
    "companyId" UUID,
    "informarGTIN" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_cpfCnpj_key" ON "provider"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "nfe" ADD CONSTRAINT "nfe_fornecedor_fkey" FOREIGN KEY ("fornecedor") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
