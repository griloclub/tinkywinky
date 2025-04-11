import { Match } from './match.entity';
import { MatchEvent } from './match-event.entity';
import { Player } from '../../player/domain/player.entity';
import { MatchStats } from './match-stats.entity';

describe('Match Entity', () => {
  let match: Match;
  let players: Player[];

  beforeEach(() => {
    players = [
      new Player({ id: '1', name: 'Player1' }),
      new Player({ id: '2', name: 'Player2' }),
      new Player({ id: '3', name: 'Player3' }),
    ];
    match = new Match({ ref: '1', startTime: new Date('2023-01-01T10:00:00') });
  });

  it('initializes with default values', () => {
    expect(match.ref).toBe('1');
    expect(match.startTime).toEqual(new Date('2023-01-01T10:00:00'));
    expect(match.events).toEqual([]);
    expect(match.players).toEqual([]);
  });

  it('adds events to the match', () => {
    const event = new MatchEvent({
      killer: 'Player1',
      victim: 'Player2',
      weapon: 'Gun',
      isWorldKill: false,
    });

    match.addEvent(event);

    expect(match.events).toHaveLength(1);
    expect(match.events[0]).toBe(event);
  });

  it('computes stats for players', () => {
    const events = [
      new MatchEvent({
        killer: 'Player1',
        victim: 'Player2',
        weapon: 'Gun',
        isWorldKill: false,
      }),
      new MatchEvent({
        killer: null,
        victim: 'Player3',
        weapon: null,
        isWorldKill: true,
      }),
    ];

    events.forEach((event) => match.addEvent(event));
    match.computeStats(players);

    expect(match.matchStats).toHaveLength(3);

    const player1Stats = match.matchStats.find((stats) => stats.playerId === '1');
    const player2Stats = match.matchStats.find((stats) => stats.playerId === '2');
    const player3Stats = match.matchStats.find((stats) => stats.playerId === '3');

    expect(player1Stats?.frags).toBe(1);
    expect(player1Stats?.deaths).toBe(0);

    expect(player2Stats?.frags).toBe(0);
    expect(player2Stats?.deaths).toBe(1);

    expect(player3Stats?.frags).toBe(0);
    expect(player3Stats?.deaths).toBe(1);
  });

  it('throws an error if a player is not found during stats computation', () => {
    const event = new MatchEvent({
      killer: 'UnknownPlayer',
      victim: 'Player2',
      weapon: 'Gun',
      isWorldKill: false,
    });

    match.addEvent(event);

    expect(() => match.computeStats(players)).toThrowError('Player UnknownPlayer not found');
  });

  it('converts to raw format', () => {
    const raw = match.toRaw();

    expect(raw).toEqual({
      id: undefined,
      ref: '1',
      startTime: new Date('2023-01-01T10:00:00'),
      endTime: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
  });
});
