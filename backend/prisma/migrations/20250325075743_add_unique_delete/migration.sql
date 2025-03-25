/*
  Warnings:

  - You are about to drop the column `quintity` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "quintity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
