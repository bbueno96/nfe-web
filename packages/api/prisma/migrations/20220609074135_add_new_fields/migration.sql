/*
  Warnings:

  - The `cfop` column on the `nfe_produto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cf` column on the `nfe_produto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[companyId]` on the table `parameter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unidade` to the `nfe_produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "informarGTIN" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "fornecedor" ADD COLUMN     "informarGTIN" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "nfe" ADD COLUMN     "complemento" VARCHAR(150),
ADD COLUMN     "erros" TEXT,
ADD COLUMN     "processado" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "idCountry" SET DEFAULT 55,
ALTER COLUMN "descCountry" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "nfe_produto" ADD COLUMN     "quantidadeRef" DECIMAL(10,4),
ADD COLUMN     "unidade" VARCHAR(3) NOT NULL,
DROP COLUMN "cfop",
ADD COLUMN     "cfop" INTEGER,
DROP COLUMN "cf",
ADD COLUMN     "cf" INTEGER;

-- AlterTable
ALTER TABLE "parameter" ADD COLUMN     "ultNota" INTEGER;

-- CreateTable
CREATE TABLE "nfe_ref" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nota" UUID,
    "estorno" BOOLEAN NOT NULL DEFAULT false,
    "companyId" UUID,

    CONSTRAINT "nfe_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfe_storage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR(250) NOT NULL,
    "conteudo" BYTEA,
    "companyId" UUID,

    CONSTRAINT "nfe_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfe_lote_queue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "statusLote" VARCHAR(250),
    "recibo" VARCHAR(250),
    "companyId" UUID,

    CONSTRAINT "nfe_lote_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parameter_companyId_key" ON "parameter"("companyId");
INSERT INTO parameter(
	id,"nfeBairro", "nfeCep", "nfeCidade", "nfeCidadeCod", "nfeCnae", "nfeCnpj", "nfeCrt", "nfeCsc", "nfeFantasia", "nfeFone", "nfeHomologation", "nfeIe", "nfeIm", "nfeIndPresenca", "nfeLagradouro", "nfeNumero", "nfeRazao", "nfeUf", "nfeUfCod", "companyId", serie) VALUES ('87471007-2e00-49ff-94d2-a6ace0cc034d', 'Jardim Paulista', '19023450', 'Presidente Prudente',3541406, '6209100', '22540716000114', 1, '0000000', 'EXPERT CAPTURA E PROCESSAMENTO DE DADOS LTDA', '(18) 0000-0000', true, '562362889111', '000000000', 3, 'Avenida Washington Luiz', '2728', 'EXPERT CAPTURA E PROCESSAMENTO DE DADOS LTDA','SP', 35,'d15cec8a-c4b7-417c-99e1-d3266190d580', 0);
