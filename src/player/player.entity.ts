import { MatchStats } from 'src/match/domain/match-stats.entity';

export type PlayerRaw = {
  id?: string;
  name: string;
  frags: number;
  deaths: number;
  kdr: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Player {
  id?: string;
  name: string;
  frags: number;
  deaths: number;
  kdr: number;
  createdAt?: Date;
  updatedAt?: Date;
  matchStats: MatchStats[];

  constructor(props: Partial<PlayerRaw> = {}, matchStats: MatchStats[] = []) {
    Object.assign(this, props);
    this.matchStats = matchStats;
  }

  toRaw(): PlayerRaw {
    return {
      id: this.id,
      name: this.name,
      frags: this.frags,
      deaths: this.deaths,
      kdr: this.kdr,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addFrag(): void {
    this.frags++;
    this.computeKdr();
  }

  addDeath(): void {
    this.deaths++;
    this.computeKdr();
  }

  private computeKdr(): void {
    this.kdr = this.deaths === 0 ? this.frags : Number((this.frags / this.deaths).toFixed(2));
  }
}
