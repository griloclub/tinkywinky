import { MatchStats } from './match-stats.entity';
import { Player } from '../../player/domain/player.entity';

describe('MatchStats', () => {
  let player: Player;
  let matchStats: MatchStats;

  beforeEach(() => {
    player = new Player({ id: 'player1', name: 'Player1' });
    jest.spyOn(player, 'addFrag');
    jest.spyOn(player, 'addDeath');
    matchStats = new MatchStats({ matchId: 'match1', playerId: 'player1' }, player);
  });

  it('initializes with default values', () => {
    expect(matchStats.frags).toBe(0);
    expect(matchStats.deaths).toBe(0);
    expect(matchStats.kdr).toBeUndefined();
    expect(matchStats.fragStreak).toBe(0);
    expect(matchStats.currentFragStreak).toBe(0);
    expect(matchStats.matchId).toBe('match1');
    expect(matchStats.playerId).toBe('player1');
    expect(matchStats.player).toBe(player);
  });

  it('increments frags and updates streaks and KDR', () => {
    matchStats.addFrag();
    expect(matchStats.frags).toBe(1);
    expect(matchStats.currentFragStreak).toBe(1);
    expect(matchStats.fragStreak).toBe(1);
    expect(matchStats.kdr).toBe(1);
    expect(player.addFrag).toHaveBeenCalledTimes(1);

    matchStats.addFrag();
    expect(matchStats.frags).toBe(2);
    expect(matchStats.currentFragStreak).toBe(2);
    expect(matchStats.fragStreak).toBe(2);
    expect(matchStats.kdr).toBe(2);
    expect(player.addFrag).toHaveBeenCalledTimes(2);
  });

  it('increments deaths and resets current streak while updating KDR', () => {
    matchStats.addFrag();
    matchStats.addFrag();
    matchStats.addDeath();

    expect(matchStats.deaths).toBe(1);
    expect(matchStats.currentFragStreak).toBe(0);
    expect(matchStats.fragStreak).toBe(2);
    expect(matchStats.kdr).toBe(2);
    expect(player.addDeath).toHaveBeenCalledTimes(1);

    matchStats.addDeath();
    expect(matchStats.deaths).toBe(2);
    expect(matchStats.kdr).toBe(1);
    expect(player.addDeath).toHaveBeenCalledTimes(2);
  });

  it('computes KDR correctly when deaths are zero', () => {
    matchStats.addFrag();
    expect(matchStats.kdr).toBe(1);

    matchStats.addFrag();
    expect(matchStats.kdr).toBe(2);
  });

  it('converts to raw format correctly', () => {
    matchStats.addFrag();
    matchStats.addDeath();

    const raw = matchStats.toRaw();
    expect(raw).toEqual({
      id: undefined,
      matchId: 'match1',
      playerId: 'player1',
      frags: 1,
      deaths: 1,
      kdr: 1,
      fragStreak: 1,
      createdAt: undefined,
      updatedAt: undefined,
    });
  });
});
