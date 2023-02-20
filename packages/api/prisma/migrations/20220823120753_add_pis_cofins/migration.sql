-- AlterTable
ALTER TABLE "nfe_produto" ADD COLUMN     "alqCofins" DECIMAL(10,4),
ADD COLUMN     "alqPis" DECIMAL(10,4),
ADD COLUMN     "cstCofins" VARCHAR(8),
ADD COLUMN     "cstPis" VARCHAR(8),
ADD COLUMN     "pisCofins" BOOLEAN NOT NULL DEFAULT false;
