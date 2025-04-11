import { Controller, Get } from '@nestjs/common';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.use-case';

@Controller('players')
export class PlayerController {
  constructor(private readonly getGlobalRankingUseCase: GetGlobalRankingUseCase) {}

  @Get('ranking')
  async getGlobalRanking() {
    return this.getGlobalRankingUseCase.execute();
  }
}
