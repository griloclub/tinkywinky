import { MatchStats } from 'src/match-stats/match-stats.entity';
import { MatchEvent } from './match-event.entity';
import { Player } from 'src/player/player.entity';

export type MatchRaw = {
  id?: string;
  ref: string;
  startTime: Date;
  endTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Match {
  id?: string;
  ref: string;
  startTime: Date;
  endTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  players: Player[];
  events: MatchEvent[];
  matchStats: MatchStats[];

  constructor(props: Partial<MatchRaw> = {}, events: MatchEvent[] = [], players: Player[] = []) {
    Object.assign(this, props);
    this.events = events ?? [];
    this.players = players ?? [];
  }

  toRaw(): MatchRaw {
    return {
      id: this.id,
      ref: this.ref,
      startTime: this.startTime,
      endTime: this.endTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addEvent(event: MatchEvent): void {
    this.events.push(event);
  }

  computeStats(players: Player[]): void {
    const statsMap = new Map<string, MatchStats>();

    for (const event of this.events) {
      const victimStats = this.getOrCreateStats(event.victim, statsMap, players);
      victimStats.addDeath();

      if (!event.killer || event.isWorldKill) {
        continue;
      }

      const killerStats = this.getOrCreateStats(event.killer, statsMap, players);
      killerStats.addFrag();
    }

    this.matchStats = Array.from(statsMap.values());
  }

  private getOrCreateStats(
    name: string,
    statsMap: Map<string, MatchStats>,
    players: Player[],
  ): MatchStats {
    if (!statsMap.has(name)) {
      const player = players.find((player) => player.name === name);
      if (!player) {
        throw new Error(`Player ${name} not found`);
      }
      statsMap.set(name, new MatchStats({ playerId: player.id }, player));
    }
    return statsMap.get(name)!;
  }
}
