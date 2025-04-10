import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'date-fns';

type ParsedMatch = {
  id: string;
  startTime: string;
  endTime: string;
  events: {
    timestamp: string;
    killer: string | null;
    victim: string;
    weapon: string | null;
    isWorldKill: boolean;
  }[];
};

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async loadMatches(log: string) {
    const matches = this.parseLog(log);
    for (const match of matches) {
      await this.saveMatch(match);
    }
  }

  private parseLog(log: string): ParsedMatch[] {
    const events = log.split('\n');
    const matches: ParsedMatch[] = [];
    let currentMatch: ParsedMatch | null = null;

    for (const event of events) {
      if (event.includes('has started')) {
        const [timestamp, action] = event.split(' - ');
        currentMatch = {
          id: action.split(' ')[2],
          startTime: timestamp,
          endTime: '',
          events: [],
        };
        matches.push(currentMatch);
        continue;
      }

      if (event.includes('has ended')) {
        if (!currentMatch) continue;
        currentMatch.endTime = event.split(' - ')[0];
        continue;
      }

      if (event.includes('killed')) {
        const [timestamp, action] = event.split(' - ');
        const words = action.split(' ');
        const killer = words[0];
        const victim = words[2];
        const isWorldKill = killer === '<WORLD>';
        const weapon = isWorldKill ? null : words[4];

        currentMatch?.events.push({
          timestamp,
          killer: isWorldKill ? null : killer,
          victim,
          weapon,
          isWorldKill,
        });
      }
    }

    return matches;
  }

  async saveMatch(match: ParsedMatch) {
    this.prisma.$transaction(async (prisma) => {
      await prisma.match.delete({
        where: {
          matchId: match.id,
        },
      });

      const createdMatch = await prisma.match.create({
        data: {
          matchId: match.id,
          startTime: parse(match.startTime, 'dd/MM/yyyy HH:mm:ss', new Date()),
          endTime: parse(match.endTime, 'dd/MM/yyyy HH:mm:ss', new Date()),
        },
      });

      const events = match.events.map((event) => ({
        timestamp: parse(event.timestamp, 'dd/MM/yyyy HH:mm:ss', new Date()),
        killer: event.killer,
        victim: event.victim,
        weapon: event.weapon,
        isWorldKill: event.isWorldKill,
        matchId: createdMatch.id,
      }));

      await prisma.matchEvent.createMany({
        data: events,
      });
    });
  }
}
