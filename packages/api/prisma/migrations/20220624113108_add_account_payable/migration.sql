-- CreateTable
CREATE TABLE "bank_account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(250),
    "institution" VARCHAR(250),
    "number" INTEGER NOT NULL,
    "verifyingDigit" INTEGER NOT NULL,
    "agency" INTEGER NOT NULL,
    "disabledAt" TIMESTAMPTZ,
    "companyId" UUID,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(250),
    "description" VARCHAR(250),
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "parentId" UUID,
    "disabledAt" TIMESTAMPTZ,
    "companyId" UUID,

    CONSTRAINT "classification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_payable" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(250) NOT NULL,
    "dueDate" TIMESTAMPTZ NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "discount" DECIMAL(10,4) NOT NULL,
    "addition" DECIMAL(10,4) NOT NULL,
    "numberInstallment" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,
    "providerId" UUID NOT NULL,
    "document" VARCHAR(250),
    "classificationId" UUID NOT NULL,
    "disabledAt" TIMESTAMPTZ,
    "accountPaymentId" UUID NOT NULL,
    "companyId" UUID,

    CONSTRAINT "account_payable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL(10,4) NOT NULL,
    "paymentMeanId" INTEGER NOT NULL,
    "bankAccountId" UUID NOT NULL,
    "companyId" UUID,

    CONSTRAINT "account_payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account_payable" ADD CONSTRAINT "account_payable_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_payable" ADD CONSTRAINT "account_payable_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "classification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_payable" ADD CONSTRAINT "account_payable_accountPaymentId_fkey" FOREIGN KEY ("accountPaymentId") REFERENCES "account_payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_payment" ADD CONSTRAINT "account_payment_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
