import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { ProcessMatchLogUseCase } from './use-cases/process-match-log.use-case';
import { MatchLogParserService } from './services/match-log-parser.service';
import { MatchRepository } from './match.repository';
import { PlayerRepository } from '../player/player.repository';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.use-case';
import { GetMatchesUseCase } from './use-cases/get-matches.use-case';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [
    ProcessMatchLogUseCase,
    GetMatchRankingUseCase,
    GetMatchesUseCase,
    MatchLogParserService,
    MatchRepository,
    PlayerRepository,
  ],
})
export class MatchModule {}
