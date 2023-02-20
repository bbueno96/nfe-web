/*
  Warnings:

  - The `companyId` column on the `brand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `companyId` column on the `customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `companyId` column on the `group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `accessToken` on the `parameter` table. All the data in the column will be lost.
  - You are about to drop the column `fine` on the `parameter` table. All the data in the column will be lost.
  - You are about to drop the column `homologation` on the `parameter` table. All the data in the column will be lost.
  - You are about to drop the column `interest` on the `parameter` table. All the data in the column will be lost.
  - The `companyId` column on the `parameter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `companyId` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `rate` on the `tax_situation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "brand" DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID;

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID;

-- AlterTable
ALTER TABLE "group" DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID;

-- AlterTable
ALTER TABLE "parameter" DROP COLUMN "accessToken",
DROP COLUMN "fine",
DROP COLUMN "homologation",
DROP COLUMN "interest",
ADD COLUMN     "emailCopyEmail" VARCHAR(250),
ADD COLUMN     "emailHost" VARCHAR(100),
ADD COLUMN     "emailPassword" VARCHAR(250),
ADD COLUMN     "emailPort" INTEGER,
ADD COLUMN     "emailUsername" VARCHAR(100),
ADD COLUMN     "nfeBairro" VARCHAR(100),
ADD COLUMN     "nfeCep" VARCHAR(100),
ADD COLUMN     "nfeCidade" VARCHAR(100),
ADD COLUMN     "nfeCidadeCod" INTEGER,
ADD COLUMN     "nfeCnae" VARCHAR(250),
ADD COLUMN     "nfeCnpj" VARCHAR(100),
ADD COLUMN     "nfeCrt" INTEGER,
ADD COLUMN     "nfeCsc" VARCHAR(250),
ADD COLUMN     "nfeFantasia" VARCHAR(250),
ADD COLUMN     "nfeFone" VARCHAR(100),
ADD COLUMN     "nfeHomologation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nfeIe" VARCHAR(100),
ADD COLUMN     "nfeIm" VARCHAR(250),
ADD COLUMN     "nfeIndPresenca" INTEGER,
ADD COLUMN     "nfeLagradouro" VARCHAR(250),
ADD COLUMN     "nfeNumero" VARCHAR(100),
ADD COLUMN     "nfeRazao" VARCHAR(250),
ADD COLUMN     "nfeUf" VARCHAR(100),
ADD COLUMN     "nfeUfCod" INTEGER,
DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID;

-- AlterTable
ALTER TABLE "tax_situation" DROP COLUMN "rate",
ADD COLUMN     "aliquotaIcms" DECIMAL(10,2),
ADD COLUMN     "aliquotaIcmsSt" DECIMAL(10,2),
ADD COLUMN     "baseIcms" DECIMAL(10,2) DEFAULT 100,
ADD COLUMN     "baseIcmsSt" DECIMAL(10,2),
ADD COLUMN     "mva" DECIMAL(10,3),
ADD COLUMN     "simplesNacional" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "nfe" (
    "id" UUID NOT NULL,
    "codNota" INTEGER NOT NULL,
    "cliente" UUID,
    "razaoSocial" VARCHAR(250),
    "endereco" VARCHAR(250),
    "numero" VARCHAR(30),
    "cidade" VARCHAR(150),
    "estado" VARCHAR(2),
    "bairro" VARCHAR(100),
    "cep" VARCHAR(20),
    "fornecedor" UUID,
    "fone" VARCHAR(20),
    "data" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numeroNota" INTEGER,
    "status" VARCHAR(20) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "transpNome" VARCHAR(20),
    "volumes" DECIMAL(10,4),
    "especie" VARCHAR(150),
    "pesoBruto" DECIMAL(10,4),
    "pesoLiquido" DECIMAL(10,4),
    "frete" DECIMAL(10,4),
    "seguro" DECIMAL(10,4),
    "outrasDespesas" DECIMAL(10,4),
    "freteOutros" DECIMAL(10,4),
    "desconto" DECIMAL(10,4),
    "totalCheque" DECIMAL(10,4),
    "totalDinheiro" DECIMAL(10,4),
    "totalCartaoCredito" DECIMAL(10,4),
    "totalBoleto" DECIMAL(10,4),
    "totalOutros" DECIMAL(10,4),
    "totalCartaoDebito" DECIMAL(10,4),
    "totalNota" DECIMAL(10,4),
    "totalProduto" DECIMAL(10,4),
    "serie" INTEGER,
    "qtdePagina" INTEGER,
    "qtdeItens" INTEGER,
    "qtdeProdutos" INTEGER,
    "baseICMS" DECIMAL(10,4) NOT NULL,
    "valorICMS" DECIMAL(10,4),
    "valorTributo" DECIMAL(10,4),
    "rgIe" VARCHAR(150),
    "cpfCnpj" VARCHAR(150),
    "dataSaida" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataOrigem" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estorno" BOOLEAN NOT NULL DEFAULT false,
    "complementar" BOOLEAN NOT NULL DEFAULT false,
    "dataAutorizacao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "naturezaOp" VARCHAR(150),
    "tipoFrete" INTEGER,
    "transpCpfCnpj" VARCHAR(150),
    "transpRgIe" VARCHAR(150),
    "transpEndereco" VARCHAR(150),
    "transpEstado" VARCHAR(150),
    "transpCidade" VARCHAR(150),
    "observacoes" VARCHAR(150),
    "informacoesFisco" VARCHAR(150),
    "nfeRef" INTEGER,
    "idCountry" INTEGER,
    "descCountry" INTEGER,
    "nDi" VARCHAR(150),
    "dDi" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xLocDesemb" VARCHAR(150),
    "uFDesemb" VARCHAR(150),
    "tpViaTransp" INTEGER,
    "cExportador" VARCHAR(150),
    "sequencia" INTEGER,
    "nomeLote" VARCHAR(150),
    "impressa" BOOLEAN NOT NULL DEFAULT false,
    "dataImpressao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "cartaCorrecao" VARCHAR(150),
    "statuscartaCorrecao" VARCHAR(150),
    "nSeqEventos" INTEGER,
    "reciboLote" VARCHAR(150),
    "companyId" UUID,

    CONSTRAINT "nfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfe_produto" (
    "id" UUID NOT NULL,
    "nota" UUID,
    "produto" UUID,
    "descricao" VARCHAR(150) NOT NULL,
    "cfop" VARCHAR(5) NOT NULL,
    "ncm" VARCHAR(8) NOT NULL,
    "quantidade" DECIMAL(10,4),
    "unitario" DECIMAL(10,4),
    "total" DECIMAL(10,4),
    "st" INTEGER NOT NULL,
    "stNfe" UUID,
    "cf" UUID,
    "baseICMS" DECIMAL(10,4),
    "valorICMS" DECIMAL(10,4),
    "aliquotaICMS" DECIMAL(10,4),
    "baseTributo" DECIMAL(10,4),
    "refProduto" VARCHAR(250),
    "cest" VARCHAR(150),
    "baseIcmsSt" DECIMAL(10,4),
    "valorIcmsSt" DECIMAL(10,4),
    "aliquotaIcmsSt" DECIMAL(10,4),
    "mva" DECIMAL(10,4),
    "companyId" UUID,

    CONSTRAINT "nfe_produto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nfe" ADD CONSTRAINT "nfe_cliente_fkey" FOREIGN KEY ("cliente") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_produto" ADD CONSTRAINT "nfe_produto_stNfe_fkey" FOREIGN KEY ("stNfe") REFERENCES "tax_situation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_produto" ADD CONSTRAINT "nfe_produto_produto_fkey" FOREIGN KEY ("produto") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_produto" ADD CONSTRAINT "nfe_produto_nota_fkey" FOREIGN KEY ("nota") REFERENCES "nfe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
