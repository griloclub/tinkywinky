import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'date-fns';
import { MatchEvent } from '@prisma/client';

type ParsedMatch = {
  ref: string;
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

  async getMatches() {
    return this.prisma.match.findMany({
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async getMatchRanking(id: string) {
    const events = await this.prisma.matchEvent.findMany({
      where: {
        matchId: id,
      },
    });

    const ranking: Record<
      string,
      {
        frags: number;
        deaths: number;
      }
    > = events.reduce((acc, event) => {
      if (!acc[event.victim]) {
        acc[event.victim] = { frags: 0, deaths: 0 };
      }
      acc[event.victim].deaths++;

      if (!event.killer) return acc;

      if (!acc[event.killer]) {
        acc[event.killer] = { frags: 0, deaths: 0 };
      }
      acc[event.killer].frags++;

      return acc;
    }, {});

    const sortedRanking = Object.entries(ranking)
      .map(([player, stats]) => ({
        player,
        frags: stats.frags,
        deaths: stats.deaths,
        kdr: Number((stats.frags / (stats.deaths || 1)).toFixed(2)),
      }))
      .sort((a, b) => {
        if (a.frags === b.frags) {
          return a.deaths - b.deaths;
        }
        return b.frags - a.frags;
      });

    return sortedRanking;
  }

  private parseLog(log: string): ParsedMatch[] {
    const events = log.split('\n');
    const matches: ParsedMatch[] = [];
    let currentMatch: ParsedMatch | null = null;

    for (const event of events) {
      if (event.includes('has started')) {
        const [timestamp, action] = event.split(' - ');
        currentMatch = {
          ref: action.split(' ')[2],
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
      await prisma.match.deleteMany({
        where: {
          ref: match.ref,
        },
      });

      const createdMatch = await prisma.match.create({
        data: {
          ref: match.ref,
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
