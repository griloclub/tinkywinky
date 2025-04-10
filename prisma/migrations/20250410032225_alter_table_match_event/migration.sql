/*
  Warnings:

  - You are about to drop the column `isWorld` on the `MatchEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchEvent" DROP COLUMN "isWorld",
ADD COLUMN     "isWorldKill" BOOLEAN NOT NULL DEFAULT false;
