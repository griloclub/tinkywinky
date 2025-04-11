import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { PrismaModule } from 'src/prisma.module';
import { ProcessMatchLogUseCase } from './use-cases/process-match-log.use-case';
import { MatchLogParserService } from './services/match-log-parser.service';
import { MatchRepository } from './match.repository';
import { MatchService } from './match.service';
import { PlayerRepository } from 'src/player/player.repository';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [
    ProcessMatchLogUseCase,
    GetMatchRankingUseCase,
    MatchLogParserService,
    MatchService,
    MatchRepository,
    PlayerRepository,
  ],
})
export class MatchModule {}
