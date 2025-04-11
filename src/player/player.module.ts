import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { PlayerRepository } from 'src/player/player.repository';
import { PlayerController } from './player.controller';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerRepository, GetGlobalRankingUseCase],
})
export class PlayerModule {}
