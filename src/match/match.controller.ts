import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProcessMatchLogUseCase } from './use-cases/process-match-log.use-case';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.use-case';
import { GetMatchesUseCase } from './use-cases/get-matches.use-case';

@Controller('matches')
export class MatchController {
  constructor(
    private readonly processMatchLogUseCase: ProcessMatchLogUseCase,
    private readonly getMatchRankingUseCase: GetMatchRankingUseCase,
    private readonly getMatchesUseCase: GetMatchesUseCase,
  ) {}

  @Post('logs')
  @UseInterceptors(FileInterceptor('file'))
  async processMatchLog(@UploadedFile() file: Express.Multer.File) {
    await this.processMatchLogUseCase.execute(file.buffer.toString());
  }

  @Get()
  async getMatches() {
    return this.getMatchesUseCase.execute();
  }

  @Get(':id/ranking')
  async getMatchRanking(@Param('id') id: string) {
    return await this.getMatchRankingUseCase.execute(id);
  }
}
