/*
  Warnings:

  - You are about to drop the column `matchId` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ref]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ref` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Match_matchId_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchId",
ADD COLUMN     "ref" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_ref_key" ON "Match"("ref");
