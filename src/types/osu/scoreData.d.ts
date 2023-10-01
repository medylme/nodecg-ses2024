export interface ScoreData {
  beatmapId: string;
  teamBlueId: number;
  teamBlueName: string;
  teamBlueScore: number;
  teamRedId: number;
  teamRedName: string;
  teamRedScore: number
}

interface ComparisonScore {
  teamBlueScore: number;
  teamRedScore: number;
}

interface ComparisonScoreWithCode extends ComparisonScore {
  code: string;
}

interface ComparisonScores {
  [key: string]: ComparisonScore;
}

interface Pools {
  [key: string]: string[];
}
