import { Injectable } from '@nestjs/common';
import { Match } from '../domain/match.entity';
import { parseMatchLogDate } from '../../shared/utils/date.utils';
import { MatchEvent } from '../domain/match-event.entity';

export type MatchLogParsed = {
  matches: Match[];
  playerNames: Set<string>;
};

@Injectable()
export class MatchLogParserService {
  parse(log: string): MatchLogParsed {
    const matches: Match[] = [];
    const playerNames = new Set<string>();
    let currentMatch: Match | null = null;

    for (const line of log.split('\n')) {
      if (line.includes('has started')) {
        currentMatch = this.handleStart(line, matches);
        continue;
      }

      if (line.includes('has ended')) {
        this.handleEnd(line, currentMatch);
        continue;
      }

      if (line.includes('killed')) {
        this.handleKill(line, currentMatch, playerNames);
      }
    }

    return { matches, playerNames };
  }

  private handleStart(line: string, matches: Match[]): Match {
    const [timestamp, action] = line.split(' - ');
    const ref = action.split(' ')[2];
    const match = new Match({
      ref,
      startTime: parseMatchLogDate(timestamp),
    });
    matches.push(match);
    return match;
  }

  private handleEnd(line: string, currentMatch: Match | null) {
    if (!currentMatch) return;
    const [timestamp] = line.split(' - ');
    currentMatch.endTime = parseMatchLogDate(timestamp);
  }

  private handleKill(line: string, currentMatch: Match | null, playerNames: Set<string>) {
    if (!currentMatch) return;
    const [timestamp, action] = line.split(' - ');
    const [killer, , victim, , weapon] = action.split(' ');

    const isWorldKill = killer === '<WORLD>';
    if (!isWorldKill) playerNames.add(killer);
    playerNames.add(victim);

    const event = new MatchEvent({
      timestamp: parseMatchLogDate(timestamp),
      killer: isWorldKill ? null : killer,
      victim,
      weapon: isWorldKill ? null : weapon,
      isWorldKill,
    });

    currentMatch.addEvent(event);
  }
}
