import { Player } from 'src/player/player.entity';

export type MatchStatsRaw = {
  id?: string;
  matchId?: string;
  playerId?: string;
  frags: number;
  deaths: number;
  kdr: number;
  fragStreak: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class MatchStats {
  id?: string;
  matchId: string;
  playerId: string;
  frags: number = 0;
  deaths: number = 0;
  kdr: number;
  fragStreak: number = 0;
  currentFragStreak: number = 0;
  createdAt?: Date;
  updatedAt?: Date;
  player?: Player;

  constructor(props: Partial<MatchStatsRaw> = {}, player?: Player) {
    Object.assign(this, props);
    this.player = player;
  }

  toRaw(): MatchStatsRaw {
    return {
      id: this.id,
      matchId: this.matchId,
      playerId: this.playerId,
      frags: this.frags,
      deaths: this.deaths,
      kdr: this.kdr,
      fragStreak: this.fragStreak,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addFrag(): void {
    this.frags++;
    this.currentFragStreak++;
    this.fragStreak = Math.max(this.fragStreak, this.currentFragStreak);
    this.computeKdr();
    this.player?.computeStats(this);
  }

  addDeath(): void {
    this.deaths++;
    this.currentFragStreak = 0;
    this.computeKdr();
    this.player?.computeStats(this);
  }

  private computeKdr(): void {
    this.kdr = this.deaths === 0 ? this.frags : Number((this.frags / this.deaths).toFixed(2));
  }
}
