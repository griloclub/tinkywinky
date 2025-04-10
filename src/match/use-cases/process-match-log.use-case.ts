import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../match.repository';
import { MatchLogParserService } from '../services/match-log-parser.service';

@Injectable()
export class ProcessMatchLogUseCase {
  constructor(
    private readonly matchLogParserService: MatchLogParserService,
    private readonly matchRepository: MatchRepository,
  ) {}

  async execute(log: string) {
    const matches = this.matchLogParserService.parse(log);

    for (const match of matches) {
      await this.matchRepository.saveMatch(match);
    }
  }
}
