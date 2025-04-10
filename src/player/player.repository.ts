import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Player } from './player.entity';

@Injectable()
export class PlayerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async savePlayers(player: Player) {
    return await this.prismaService.$transaction(async (prisma) => {});
  }
}
