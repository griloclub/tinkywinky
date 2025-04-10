export type MatchEventRaw = {
  id?: string;
  matchId?: string;
  timestamp: Date;
  killer: string | null;
  victim: string;
  weapon: string | null;
  isWorldKill: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class MatchEvent {
  id?: string;
  matchId?: string;
  timestamp: Date;
  killer: string | null;
  victim: string;
  weapon: string | null;
  isWorldKill: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<MatchEventRaw>) {
    Object.assign(this, props);
  }

  toRaw(): MatchEventRaw {
    return {
      id: this.id,
      matchId: this.matchId,
      timestamp: this.timestamp,
      killer: this.killer,
      victim: this.victim,
      weapon: this.weapon,
      isWorldKill: this.isWorldKill,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
