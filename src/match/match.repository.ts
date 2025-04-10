import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Match } from './domain/match.entity';

@Injectable()
export class MatchRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMatch(match: Match) {
    return await this.prismaService.$transaction(async (prisma) => {
      await prisma.match.deleteMany({ where: { ref: match.ref } });

      const createdMatch = await prisma.match.create({ data: match.toRaw() });

      if (!match.events.length) return;

      const eventsData = match.events.map((e) => ({ ...e.toRaw(), matchId: createdMatch.id }));
      await prisma.matchEvent.createMany({ data: eventsData });
    });
  }
}
