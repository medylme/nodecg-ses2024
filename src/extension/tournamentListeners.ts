/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/indent */
import { Team, Map, ComparisonScore, ComparisonScores, Score } from '@nodecg-vue-ts-template/types/osu';
import { open } from 'sqlite';
import { get as nodecg } from './util/nodecg';
import { currentTeamsReplicant, currentComparisonPoolReplicant, currentComparisonsReplicant, currentComparisonsScoresReplicant, currentPoolsReplicant, currentComparisonTwoPoolReplicant, currentComparisonsTwoReplicant, currentComparisonsTwoScoresReplicant } from './util/replicants';
import Pools from './util/pools';
import OsuApiUtils from './util/osuApiUtils';

const sqlite3 = require('sqlite3').verbose();

// Replicants
class Replicants {
  public static async setTeamComparisonDefaults(): Promise<void> {
    const db = await open({
      filename: 'db/wah2023.sqlite3',
      driver: sqlite3.cached.Database,
    });
    const teamArray: Team[] = await db.all('SELECT * FROM Team');

    if (currentComparisonPoolReplicant.value === undefined) {
      currentComparisonsReplicant.value = teamArray.slice(0, 2);
    }

    if (currentComparisonTwoPoolReplicant.value === undefined) {
      currentComparisonsTwoReplicant.value = teamArray.slice(0, 2);
    }

    nodecg().sendMessage('updateComparisonScores');
    nodecg().sendMessage('updateComparisonTwoScores');
  }

  public static async generateTeamsReplicant(): Promise<void> {
    const db = await open({
      filename: 'db/wah2023.sqlite3',
      driver: sqlite3.cached.Database,
    });

    const teamArray: Team[] = await db.all('SELECT * FROM Team');
    currentTeamsReplicant.value = teamArray;
  }

  public static generatePoolsReplicant(): void {
    currentPoolsReplicant.value = Pools[currentComparisonPoolReplicant.value];
  }
}

Replicants.generatePoolsReplicant();
Replicants.generateTeamsReplicant();
Replicants.setTeamComparisonDefaults();

// Test osu! API
OsuApiUtils.testApiKey().then((data) => {
  if (data.error) {
    nodecg().log.error(data.error);
    throw new Error('osu! API test failed!');
  } else {
    nodecg().log.info('osu! API utils working.');
  }
});

function correctScore(score: number, map_id: string): number {
  let ezMultiplier = 1;
  switch (map_id.toString()) {
    case '2117567': // RO16 FM1
      ezMultiplier = 2.2;
      break;
    case '4186806': // RO16 FM2
      ezMultiplier = 1.9;
      break;
    case '4328578': // QF FM1
      ezMultiplier = 2.2;
      break;
    case '3839691': // QF FM2
      ezMultiplier = 1.9;
      break;
    default:
      ezMultiplier = 1;
      break;
  }

  const correctedScore = score * ezMultiplier;
  return Math.round(correctedScore);
}

const ezModNumbers = [
  2, // EZ
  3, // EZNF
  10, // EZHD
  11, // EZHDNF
];

// - LISTENERS

nodecg().listenFor('updateComparisonScores', async () => {
  const db = await open({
    filename: 'db/wah2023.sqlite3',
    driver: sqlite3.cached.Database,
  });

  const currentPool = currentComparisonPoolReplicant.value;
  const currentComparisons = currentComparisonsReplicant.value;

  const teamBlueId = currentComparisons[0].id;
  const teamRedId = currentComparisons[1].id;

  const comparisonsScores: ComparisonScores = {};
  const mapSlots = Pools[currentPool];

  mapSlots.forEach(async (mapSlot) => {
    const slotIndex = `${currentPool}-${mapSlot}`;

    const map: Map | undefined = await db.get(`SELECT * FROM Map WHERE code = '${slotIndex}'`);

    if (map === undefined) {
      nodecg().log.error(`updateComparisonScores | Map ${slotIndex} not found in database!`);
      return;
    }

    const mapId = map.id;

    const comparisonScore: ComparisonScore = {
      teamBlueScore: 0,
      teamRedScore: 0,
    };

    const teamBlueScoreObject = await db.get(`SELECT score FROM Score WHERE map_id=${mapId} AND team_id=${teamBlueId}`);
    const teamRedScoreObject = await db.get(`SELECT score FROM Score WHERE map_id=${mapId} AND team_id=${teamRedId}`);

    let teamBlueScore: number;
    let teamRedScore: number;
    if (teamBlueScoreObject === undefined) {
      teamBlueScore = 0;
    } else {
      teamBlueScore = teamBlueScoreObject.score;
    }
    if (teamRedScoreObject === undefined) {
      teamRedScore = 0;
    } else {
      teamRedScore = teamRedScoreObject.score;
    }

    comparisonScore.teamBlueScore = teamBlueScore;
    comparisonScore.teamRedScore = teamRedScore;
    comparisonsScores[mapSlot] = comparisonScore;
  });

  currentComparisonsScoresReplicant.value = comparisonsScores;
});

nodecg().listenFor('updateComparisonTwoScores', async () => {
  const db = await open({
    filename: 'db/wah2023.sqlite3',
    driver: sqlite3.cached.Database,
  });

  const currentPool = currentComparisonTwoPoolReplicant.value;
  const currentComparisons = currentComparisonsTwoReplicant.value;

  const teamBlueId = currentComparisons[0].id;
  const teamRedId = currentComparisons[1].id;

  const comparisonsScores: ComparisonScores = {};
  const mapSlots = Pools[currentPool];

  mapSlots.forEach(async (mapSlot) => {
    const slotIndex = `${currentPool}-${mapSlot}`;

    const map: Map | undefined = await db.get(`SELECT * FROM Map WHERE code = '${slotIndex}'`);

    if (map === undefined) {
      nodecg().log.error(`updateComparisonScores 2 | Map ${slotIndex} not found in database!`);
      return;
    }

    const mapId = map.id;

    const comparisonScore: ComparisonScore = {
      teamBlueScore: 0,
      teamRedScore: 0,
    };

    const teamBlueScoreObject = await db.get(`SELECT score FROM Score WHERE map_id=${mapId} AND team_id=${teamBlueId}`);
    const teamRedScoreObject = await db.get(`SELECT score FROM Score WHERE map_id=${mapId} AND team_id=${teamRedId}`);

    let teamBlueScore: number;
    let teamRedScore: number;
    if (teamBlueScoreObject === undefined) {
      teamBlueScore = 0;
    } else {
      teamBlueScore = teamBlueScoreObject.score;
    }
    if (teamRedScoreObject === undefined) {
      teamRedScore = 0;
    } else {
      teamRedScore = teamRedScoreObject.score;
    }

    comparisonScore.teamBlueScore = teamBlueScore;
    comparisonScore.teamRedScore = teamRedScore;
    comparisonsScores[mapSlot] = comparisonScore;
  });

  currentComparisonsTwoScoresReplicant.value = comparisonsScores;
});

nodecg().listenFor('saveMatch', async (data, ack) => {
  const db = await open({
    filename: 'db/wah2023.sqlite3',
    driver: sqlite3.cached.Database,
  });

  const matchData = await OsuApiUtils.getMatchData(data.matchId);
  const { teamRedId, teamRedName, teamBlueId, teamBlueName } = data;

  await matchData.games.forEach(async (game: any) => {
    const teamBlueScores: number[] = [];
    const teamRedScores: number[] = [];

    game.scores.forEach((score: any) => {
      if (score.pass === '1') {
        let finalScore = score.score;

        if (score.enabled_mods !== null) {
          if (ezModNumbers.includes(Number(score.enabled_mods))) {
            finalScore = correctScore(score.score, game.beatmap_id);

            nodecg().log.debug(`Player ${score.user_id} used EZ mod, score was ${score.score}, corrected score is ${finalScore}`);
          }
        }

        if (score.team === '1') {
          teamBlueScores.push(finalScore);
        } else if (score.team === '2') {
          teamRedScores.push(finalScore);
        }
      }
    });

    let teamBlueScore = 0;
    teamBlueScores.forEach((score) => {
      teamBlueScore += Number(score);
    });
    let teamRedScore = 0;
    teamRedScores.forEach((score) => {
      teamRedScore += Number(score);
    });

    try {
      const mapDbObject = await db.get(`SELECT * FROM Map WHERE osu_id=${game.beatmap_id}`) as Map;
      if (mapDbObject === undefined) {
        nodecg().log.error(`saveMatch | Map ID ${game.beatmap_id} not found in database! Skipping...`);
        return;
      }

      const teamBlueScoreObject = await db.get(`SELECT * FROM Score WHERE map_id=${mapDbObject.id} AND team_id=${teamBlueId}`) as Score;
      if (teamBlueScoreObject === undefined) {
        await db.run(`INSERT INTO Score (team_id, map_id, score) VALUES (${teamBlueId}, ${mapDbObject.id}, ${teamBlueScore})`);
      } else if (teamBlueScoreObject.score < teamBlueScore) {
        await db.run(`UPDATE Score SET score=${teamBlueScore} WHERE map_id=${mapDbObject.id} AND team_id=${teamBlueId}`);
      }

      const teamRedScoreObject = await db.get(`SELECT * FROM Score WHERE map_id=${mapDbObject.id} AND team_id=${teamRedId}`) as Score;
      if (teamRedScoreObject === undefined) {
        await db.run(`INSERT INTO Score (team_id, map_id, score) VALUES (${teamRedId}, ${mapDbObject.id}, ${teamRedScore})`);
      } else if (teamRedScoreObject.score < teamRedScore) {
        await db.run(`UPDATE Score SET score=${teamRedScore} WHERE map_id=${mapDbObject.id} AND team_id=${teamRedId}`);
      }
    } catch (e) {
      nodecg().log.error(e);
    }
  });
});
