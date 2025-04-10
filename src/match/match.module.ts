import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { PrismaModule } from 'src/prisma.module';
import { ProcessMatchLogUseCase } from './use-cases/process-match-log.use-case';
import { MatchLogParserService } from './services/match-log-parser.service';
import { MatchRepository } from './match.repository';
import { MatchService } from './match.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [ProcessMatchLogUseCase, MatchLogParserService, MatchRepository, MatchService],
})
export class MatchModule {}
