import { Module } from '@nestjs/common';
import { MatchModule } from './match/match.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [MatchModule, PlayerModule],
})
export class AppModule {}
