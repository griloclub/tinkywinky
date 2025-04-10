import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportMatchesUseCase } from './use-cases/import-matches.use-case';

@Controller('matches')
export class MatchController {
  constructor(private readonly importMatchesUseCase: ImportMatchesUseCase) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importMatch(@UploadedFile() file: Express.Multer.File) {
    await this.importMatchesUseCase.execute(file.buffer.toString());
  }
}
