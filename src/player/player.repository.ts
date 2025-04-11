import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Player } from './domain/player.entity';

@Injectable()
export class PlayerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertFromNames(names: string[]) {
    return await Promise.all(names.map((name) => this.upsert(new Player({ name }))));
  }

  async upsert(player: Player) {
    const result = await this.prismaService.player.upsert({
      where: { name: player.name },
      update: {
        frags: player.frags,
        deaths: player.deaths,
      },
      create: {
        name: player.name,
        deaths: player.deaths,
        frags: player.frags,
      },
    });
    return new Player(result);
  }

  async getGlobalRanking() {
    return await this.prismaService.$queryRaw`
      SELECT p.name, p.frags, p.deaths, p.kdr
      FROM "Player" p
      ORDER BY p.frags DESC, p.deaths ASC;
    `;
  }
}
