import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../player.repository';

@Injectable()
export class GetGlobalRankingUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute() {
    return await this.playerRepository.getGlobalRanking();
  }
}
