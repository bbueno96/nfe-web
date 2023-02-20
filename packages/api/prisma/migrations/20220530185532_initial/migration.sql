-- CreateTable
CREATE TABLE "employee" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(100) NOT NULL,
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand" (
    "id" UUID NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_situation" (
    "id" UUID NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "tax_situation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" UUID NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "rate" DECIMAL(3,2),
    "cst" VARCHAR(2),
    "csosn" VARCHAR(3),
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
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
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL,
    "group" UUID,
    "brand" UUID,
    "description" VARCHAR(250) NOT NULL,
    "stock" DECIMAL(10,4) NOT NULL,
    "stockMinium" DECIMAL(10,4) NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "valueOld" DECIMAL(10,4),
    "purchaseValue" DECIMAL(10,4),
    "lastPurchase" TIMESTAMPTZ,
    "lastSale" TIMESTAMPTZ,
    "createAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "st" UUID NOT NULL,
    "und" VARCHAR(3) NOT NULL,
    "barCode" VARCHAR(250),
    "ipi" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "disableAt" TIMESTAMPTZ,
    "ncm" VARCHAR(8) NOT NULL,
    "cfop" VARCHAR(5) NOT NULL,
    "pisCofins" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(10,4),
    "height" DECIMAL(10,4),
    "width" DECIMAL(10,4),
    "length" DECIMAL(10,4),
    "color" VARCHAR(250),
    "size" DECIMAL(10,4),
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameter" (
    "id" UUID NOT NULL,
    "accessToken" VARCHAR(250) NOT NULL,
    "fine" DECIMAL(10,4) NOT NULL,
    "interest" DECIMAL(10,4) NOT NULL,
    "homologation" BOOLEAN NOT NULL DEFAULT false,
    "companyId" VARCHAR NOT NULL,

    CONSTRAINT "parameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_login_key" ON "employee"("login");

-- CreateIndex
CREATE UNIQUE INDEX "customer_cpfCnpj_key" ON "customer"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_id_fkey" FOREIGN KEY ("id") REFERENCES "brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_st_fkey" FOREIGN KEY ("st") REFERENCES "tax_situation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_group_fkey" FOREIGN KEY ("group") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
