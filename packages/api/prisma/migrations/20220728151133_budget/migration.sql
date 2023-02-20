/*
  Warnings:

  - You are about to drop the column `custonerId` on the `budget` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_custonerId_fkey";

-- AlterTable
ALTER TABLE "budget" DROP COLUMN "custonerId",
ADD COLUMN     "auth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customerId" UUID NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
