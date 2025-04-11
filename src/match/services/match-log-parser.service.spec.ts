import { Test, TestingModule } from '@nestjs/testing';
import { MatchLogParserService } from './match-log-parser.service';
import { MatchEvent } from '../domain/match-event.entity';

describe('MatchLogParserService', () => {
  let service: MatchLogParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchLogParserService],
    }).compile();

    service = module.get<MatchLogParserService>(MatchLogParserService);
  });

  it('parses a log with a single match and events', () => {
    const log = `
25/04/2020 11:00:45 - New match 1 has started
25/04/2020 11:01:45 - Player1 killed Player2 using Gun
25/04/2020 11:01:49 - <WORLD> killed Player3
25/04/2020 11:02:50 - Match 1 has ended
    `.trim();

    const result = service.parse(log);

    expect(result.matches).toHaveLength(1);
    const match = result.matches[0];
    expect(match.ref).toBe('1');
    expect(match.startTime).toEqual(new Date('2020-04-25T11:00:45'));
    expect(match.endTime).toEqual(new Date('2020-04-25T11:02:50'));
    expect(match.events).toHaveLength(2);

    const event1 = match.events[0];
    expect(event1).toBeInstanceOf(MatchEvent);
    expect(event1.killer).toBe('Player1');
    expect(event1.victim).toBe('Player2');
    expect(event1.weapon).toBe('Gun');
    expect(event1.isWorldKill).toBe(false);

    const event2 = match.events[1];
    expect(event2).toBeInstanceOf(MatchEvent);
    expect(event2.killer).toBeNull();
    expect(event2.victim).toBe('Player3');
    expect(event2.weapon).toBeNull();
    expect(event2.isWorldKill).toBe(true);

    expect(result.playerNames).toEqual(new Set(['Player1', 'Player2', 'Player3']));
  });

  it('handles logs with multiple matches', () => {
    const log = `
25/04/2020 15:00:00 - New match 1 has started
25/04/2020 15:00:45 - Player1 killed Player2 using Gun
25/04/2020 15:01:45 - Match 1 has ended
25/04/2020 15:05:48 - New match 2 has started
25/04/2020 15:16:45 - Player3 killed Player4 using Knife
25/04/2020 15:20:45 - Match 2 has ended
    `.trim();

    const result = service.parse(log);

    expect(result.matches).toHaveLength(2);

    const match1 = result.matches[0];
    expect(match1.ref).toBe('1');
    expect(match1.startTime).toEqual(new Date('2020-04-25T15:00:00'));
    expect(match1.endTime).toEqual(new Date('2020-04-25T15:01:45'));
    expect(match1.events).toHaveLength(1);

    const match2 = result.matches[1];
    expect(match2.ref).toBe('2');
    expect(match2.startTime).toEqual(new Date('2020-04-25T15:05:48'));
    expect(match2.endTime).toEqual(new Date('2020-04-25T15:20:45'));
    expect(match2.events).toHaveLength(1);

    expect(result.playerNames).toEqual(new Set(['Player1', 'Player2', 'Player3', 'Player4']));
  });

  it('handles logs with no events', () => {
    const log = `
25/04/2020 15:00:45 - New match 1 has started
25/04/2020 15:00:46 - Match 1 has ended
    `.trim();

    const result = service.parse(log);

    expect(result.matches).toHaveLength(1);
    const match = result.matches[0];
    expect(match.events).toHaveLength(0);
    expect(result.playerNames.size).toBe(0);
  });
});
