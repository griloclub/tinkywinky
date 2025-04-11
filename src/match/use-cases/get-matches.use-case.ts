import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../match.repository';

@Injectable()
export class GetMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute() {
    return await this.matchRepository.getMatches();
  }
}
