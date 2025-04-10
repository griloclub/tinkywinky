import { Injectable } from '@nestjs/common';

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
    console.log('Saving match:', match);
  }
}
