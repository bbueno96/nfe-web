-- AlterTable
ALTER TABLE "product" ADD COLUMN     "alqCofins" DECIMAL(10,4),
ADD COLUMN     "alqPis" DECIMAL(10,4),
ADD COLUMN     "cstCofins" VARCHAR(8),
ADD COLUMN     "cstPis" VARCHAR(8);

-- AlterTable
ALTER TABLE "tax_situation" ADD COLUMN     "cfopInter" VARCHAR(5),
ADD COLUMN     "cfopInterPf" VARCHAR(5),
ADD COLUMN     "cfopState" VARCHAR(5),
ADD COLUMN     "cfopStatePf" VARCHAR(5);
