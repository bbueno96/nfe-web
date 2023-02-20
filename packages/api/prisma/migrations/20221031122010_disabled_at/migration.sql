-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "disabledAt" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "conductor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(250) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "placa" VARCHAR(250) NOT NULL,
    "tara" DECIMAL(10,4) NOT NULL,
    "capKG" DECIMAL(10,4) NOT NULL,
    "capM3" DECIMAL(10,4) NOT NULL,
    "companyId" UUID,

    CONSTRAINT "conductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mdfe" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" VARCHAR(1),
    "numero" INTEGER NOT NULL,
    "serie" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ufIni" VARCHAR(2) NOT NULL,
    "ufFim" VARCHAR(2) NOT NULL,
    "codMunCarga" INTEGER NOT NULL,
    "descMunCarga" VARCHAR(250) NOT NULL,
    "dataSaida" TIMESTAMPTZ NOT NULL,
    "percurso" VARCHAR(250),
    "codMunDescarca" INTEGER NOT NULL,
    "munDescarca" VARCHAR(250) NOT NULL,
    "vTotal" DECIMAL(10,4) NOT NULL,
    "qCarga" DECIMAL(10,4) NOT NULL,
    "obs" VARCHAR(250),
    "name" VARCHAR(250) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "placa" VARCHAR(250) NOT NULL,
    "tara" DECIMAL(10,4) NOT NULL,
    "capKG" DECIMAL(10,4) NOT NULL,
    "capM3" DECIMAL(10,4) NOT NULL,
    "conductorId" UUID,
    "companyId" UUID,
    "chave" VARCHAR(250),

    CONSTRAINT "mdfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mdfe_body" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mdfeId" UUID NOT NULL,
    "nfeId" UUID NOT NULL,
    "vTotal" DECIMAL(10,4) NOT NULL,
    "qCarga" DECIMAL(10,4) NOT NULL,
    "chaveNfe" VARCHAR(250),

    CONSTRAINT "mdfe_body_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conductor_cpf_key" ON "conductor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "mdfe_cpf_key" ON "mdfe"("cpf");

-- AddForeignKey
ALTER TABLE "mdfe" ADD CONSTRAINT "mdfe_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "conductor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe_body" ADD CONSTRAINT "mdfe_body_nfeId_fkey" FOREIGN KEY ("nfeId") REFERENCES "nfe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mdfe_body" ADD CONSTRAINT "mdfe_body_mdfeId_fkey" FOREIGN KEY ("mdfeId") REFERENCES "mdfe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
