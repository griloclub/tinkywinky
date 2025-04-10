import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { LoadMatchesUseCase } from './use-cases/load-matches.use-case';

@Module({
  imports: [],
  controllers: [MatchController],
  providers: [MatchService, LoadMatchesUseCase],
})
export class MatchModule {}
