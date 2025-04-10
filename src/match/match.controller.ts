import {
  Controller,
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
}
