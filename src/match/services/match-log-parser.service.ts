import { Injectable } from '@nestjs/common';
import { Match } from '../domain/match.entity';
import { parseMatchLogDate } from 'src/shared/utils/date.utils';
import { MatchEvent } from '../domain/match-event.entity';

@Injectable()
export class MatchLogParserService {
  parse(log: string): Match[] {
    const events = log.split('\n');
    const matches: Match[] = [];
    let currentMatch: Match | null = null;

    for (const event of events) {
      if (event.includes('has started')) {
        const [timestamp, action] = event.split(' - ');
        currentMatch = new Match({
          ref: action.split(' ')[2],
          startTime: parseMatchLogDate(timestamp),
        });
        matches.push(currentMatch);
        continue;
      }

      if (event.includes('has ended')) {
        if (!currentMatch) continue;
        currentMatch.endTime = parseMatchLogDate(event.split(' - ')[0]);
        continue;
      }

      if (event.includes('killed')) {
        const [timestamp, action] = event.split(' - ');
        const words = action.split(' ');
        const killer = words[0];
        const victim = words[2];
        const isWorldKill = killer === '<WORLD>';
        const weapon = isWorldKill ? null : words[4];

        currentMatch?.addEvent(
          new MatchEvent({
            timestamp: parseMatchLogDate(timestamp),
            killer: isWorldKill ? null : killer,
            victim,
            weapon,
            isWorldKill,
          }),
        );
      }
    }

    return matches;
  }
}
