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

  computeStats(): void {
    const statsMap = new Map<string, MatchStats>();

    for (const event of this.events) {
      const victimStats = this.getOrCreateStats(statsMap, event.victim);
      victimStats.addDeath();

      if (!event.killer || event.isWorldKill) {
        continue;
      }

      const killerStats = this.getOrCreateStats(statsMap, event.killer);
      killerStats.addFrag();
    }

    this.matchStats = Array.from(statsMap.values());
  }

  private getOrCreateStats(statsMap: Map<string, MatchStats>, name: string): MatchStats {
    if (!statsMap.has(name)) {
      statsMap.set(name, new MatchStats({ matchId: this.id }));
    }
    return statsMap.get(name)!;
  }
}
