/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "companyId" UUID;

-- DropTable
DROP TABLE "employee";
INSERT INTO "admins" ("id", "name", "login", "passwordHash", "companyId")
VALUES ('50a6fe34-dbb3-496e-b5f3-ae9ab4ee86a7', 'Ricardo dos Santos Lopes', 'lopesri', '$2b$08$04TW8.uT220FoEcbvFtYCuCbUNLIGzHYfdmYke.wGAv4UtcwAOlze','d15cec8a-c4b7-417c-99e1-d3266190d580')
