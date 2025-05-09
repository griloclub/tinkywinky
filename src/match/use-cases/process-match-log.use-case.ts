import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../match.repository';
import { MatchLogParserService } from '../services/match-log-parser.service';
import { PlayerRepository } from '../../player/player.repository';

@Injectable()
export class ProcessMatchLogUseCase {
  constructor(
    private readonly matchLogParserService: MatchLogParserService,
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(log: string) {
    const { matches, playerNames } = this.matchLogParserService.parse(log);
    if (!matches.length) return;
    const players = await this.playerRepository.upsertFromNames(Array.from(playerNames));

    for (const match of matches) {
      match.computeStats(players);
      await this.matchRepository.saveMatch(match, players);
    }
  }
}
