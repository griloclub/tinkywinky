import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../match.repository';

@Injectable()
export class GetMatchRankingUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string) {
    return await this.matchRepository.getRanking(id);
  }
}
