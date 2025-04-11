import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Match } from './domain/match.entity';
import { Player } from '../player/domain/player.entity';

@Injectable()
export class MatchRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMatch(match: Match, players: Player[]) {
    return await this.prismaService.$transaction(async (prisma) => {
      /**
       * TODO: allow import existing matches by deleting the old one.
       * Player stats from reimported matches should be cleaned before to avoid duplicates.
       */

      const createdMatch = await prisma.match.create({ data: match.toRaw() });

      if (!match.events.length) return;

      await prisma.matchEvent.createMany({
        data: match.events.map((e) => ({ ...e.toRaw(), matchId: createdMatch.id })),
      });

      await prisma.matchStats.createMany({
        data: match.matchStats.map((s) => ({ ...s.toRaw(), matchId: createdMatch.id })),
      });

      // TODO: handle player stats update
      for (const player of players) {
        await prisma.player.update({
          where: { id: player.id },
          data: {
            frags: player.frags,
            deaths: player.deaths,
            kdr: player.kdr,
          },
        });
      }
    });
  }

  async getRanking(matchId: string) {
    return await this.prismaService.$queryRaw`
      SELECT p.name, ms.frags, ms.deaths, ms.kdr, ms."fragStreak"
      FROM "MatchStats" ms
      JOIN "Player" p ON p.id = ms."playerId"
      WHERE ms."matchId" = ${matchId}
      ORDER BY ms.frags DESC, ms.deaths ASC;
    `;
  }

  async getMatches() {
    return this.prismaService.match.findMany({
      orderBy: {
        startTime: 'desc',
      },
    });
  }
}
