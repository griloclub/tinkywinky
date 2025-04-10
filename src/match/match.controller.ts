import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoadMatchesUseCase } from './use-cases/load-matches.use-case';

@Controller('matches')
export class MatchController {
  constructor(private readonly loadMatchesUseCase: LoadMatchesUseCase) {}

  @Post('load')
  @UseInterceptors(FileInterceptor('file'))
  async loadMatches(@UploadedFile() file: Express.Multer.File) {
    await this.loadMatchesUseCase.execute(file.buffer.toString());
  }
}
