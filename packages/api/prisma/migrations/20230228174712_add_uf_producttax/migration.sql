/*
  Warnings:

  - Added the required column `uf` to the `product_tax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_tax" ADD COLUMN     "uf" VARCHAR(2) NOT NULL;
