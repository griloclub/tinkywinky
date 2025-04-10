import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProcessMatchLogUseCase } from './use-cases/process-match-log.use-case';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(
    private readonly processMatchLogUseCase: ProcessMatchLogUseCase,
    private readonly matchService: MatchService,
  ) {}

  @Post('logs')
  @UseInterceptors(FileInterceptor('file'))
  async processMatchLog(@UploadedFile() file: Express.Multer.File) {
    await this.processMatchLogUseCase.execute(file.buffer.toString());
  }

  @Get()
  async getMatches() {
    return this.matchService.getMatches();
  }

  @Get(':id/ranking')
  async getMatchRanking(@Param('id') id: string) {
    return await this.matchService.getMatchRanking(id);
  }
}
