-- AlterTable
ALTER TABLE "parameter" ADD COLUMN     "classificationId" UUID;

-- AlterTable
ALTER TABLE "pay_method" ADD COLUMN     "generateInstallmens" BOOLEAN NOT NULL DEFAULT true;
