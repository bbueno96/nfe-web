-- AlterTable
ALTER TABLE "nfe" ADD COLUMN     "transportador" UUID;

-- CreateTable
CREATE TABLE "transportador" (
    "id" UUID NOT NULL,
    "cpfCnpj" VARCHAR(14) NOT NULL,
    "rgIe" VARCHAR(50),
    "nome" VARCHAR(150) NOT NULL,
    "endereco" VARCHAR(150),
    "cidade" VARCHAR(150),
    "estado" VARCHAR(2),
    "veiculoPlaca" VARCHAR(10),
    "veiculoEstado" VARCHAR(2),
    "cep" VARCHAR(8),
    "fone" VARCHAR(12),
    "obs" VARCHAR(250),
    "email" VARCHAR(250),
    "enviaEmailNFE" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "transportador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transportador_cpfCnpj_key" ON "transportador"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "nfe" ADD CONSTRAINT "nfe_transportador_fkey" FOREIGN KEY ("transportador") REFERENCES "transportador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
