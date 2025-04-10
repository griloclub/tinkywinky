import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('load')
  @UseInterceptors(FileInterceptor('file'))
  async loadMatches(@UploadedFile() file: Express.Multer.File) {
    await this.matchService.loadMatches(file.buffer.toString());
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
