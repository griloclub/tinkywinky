/*
  Warnings:

  - You are about to drop the `MatchPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchPlayer" DROP CONSTRAINT "MatchPlayer_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchPlayer" DROP CONSTRAINT "MatchPlayer_playerId_fkey";

-- DropTable
DROP TABLE "MatchPlayer";

-- DropTable
DROP TABLE "Player";
