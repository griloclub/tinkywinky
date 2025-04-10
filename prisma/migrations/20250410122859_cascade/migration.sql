-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_matchId_fkey";

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
