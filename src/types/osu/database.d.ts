import { Rounds } from './rounds';

export interface Team {
  id: number;
  name: string;
}

export interface Map {
  id: number;
  code: string;
  osu_id: number;
}

export interface Score {
  team_id: number;
  map_id: number;
  score: number;
}
