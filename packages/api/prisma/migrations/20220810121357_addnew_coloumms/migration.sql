-- AlterTable
ALTER TABLE "installment" ADD COLUMN     "addressApoio" VARCHAR(250),
ADD COLUMN     "addressNumberApoio" VARCHAR(250),
ADD COLUMN     "cityIdApoio" INTEGER,
ADD COLUMN     "complementApoio" VARCHAR(250),
ADD COLUMN     "cpfCnpjApoio" VARCHAR(14),
ADD COLUMN     "emailApoio" VARCHAR(250),
ADD COLUMN     "phoneApoio" VARCHAR(250),
ADD COLUMN     "postalCodeApoio" VARCHAR(250),
ADD COLUMN     "provinceApoio" VARCHAR(250),
ADD COLUMN     "stateApoio" VARCHAR(250),
ADD COLUMN     "stateInscriptionApoio" VARCHAR(250);
