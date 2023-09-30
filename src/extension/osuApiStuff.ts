/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/indent */
import { Team, Map } from '@nodecg-vue-ts-template/types/osu';
import { get as nodecg } from './util/nodecg';
import { currentTeamsReplicant } from './util/replicants';

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db/wah2023.sqlite3');

const apiKey = process.env.OSU_API_KEY;
if (apiKey === undefined) {
  throw new Error("osu! API key not found! Please set it in the .env file as 'OSU_API_KEY'.");
}

// osu api
async function testApiKey() {
  const endpoint = `https://osu.ppy.sh/api/get_user?k=${apiKey}&u=1`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}
testApiKey().then((data) => {
  if (data.error) {
    nodecg().log.error(data.error);
    throw new Error('osu! API test failed!');
  } else {
    nodecg().log.info('osu! API utils working.');
  }
});

// Generate teams replicant
const getTeams = async () => {
  const teamArray: Team[] = [];

  await db.serialize(() => {
    db.each('SELECT * FROM Team', (err: Error, row: Team) => {
      if (err) {
        nodecg().log.error(err);
      } else {
        const team: Team = {
          id: row.id,
          name: row.name,
        };
        teamArray.push(team);
      }
    });
  });

  currentTeamsReplicant.value = teamArray;
};
getTeams();

// - FUNCTIONS

async function getMatchData(matchId: string) {
  const endpoint = `https://osu.ppy.sh/api/get_match?k=${apiKey}&mp=${matchId}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

async function getMapData(mapId: string) {
  const endpoint = `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&b=${mapId}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

function correctScore(score: number, map_id: string): number {
  let ezMultiplier = 1;
  switch (map_id.toString()) {
    case '2117567': // RO16 FM1
      ezMultiplier = 2.2;
      break;
    case '4186806': // RO16 FM2
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

nodecg().listenFor('saveMatch', async (data, ack) => {
  const matchData = await getMatchData(data.matchId);
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
      db.each(`SELECT * FROM Map WHERE osu_id=${game.beatmap_id}`, (err: Error, row: Map) => {
        if (err || row.id === undefined) {
          nodecg().log.error(`Map ID ${game.beatmap_id} not in database!`);
          return;
        }

        // Team Blue
        db.each(`SELECT * FROM Score WHERE map_id=${row.id} AND team_id=${teamBlueId}`, (err2: Error, row2: any) => {
          if (err2) {
            nodecg().log.error(err2);
            return;
          }

          // Check if score exists
          if (row2 === undefined) {
            db.run(`INSERT INTO Score (team_id, map_id, score) VALUES (${teamBlueId}, ${row.id}, ${teamBlueScore})`);
            return;
          }

          // Check if score is higher, otherwise don't update
          if (row2.score < teamBlueScore) {
            db.run(`UPDATE Score SET score=${teamBlueScore} WHERE map_id=${row.id} AND team_id=${teamBlueId}`);
          }
        });

        // Team Red
        db.each(`SELECT * FROM Score WHERE map_id=${row.id} AND team_id=${teamRedId}`, (err2: Error, row3: any) => {
          if (err2) {
            nodecg().log.error(err2);
            return;
          }

          // Check if score exists
          if (row3 === undefined) {
            db.run(`INSERT INTO Score (team_id, map_id, score) VALUES (${teamRedId}, ${row.id}, ${teamRedScore})`);
            return;
          }

          // Check if score is higher, otherwise don't update
          if (row3.score < teamRedScore) {
            db.run(`UPDATE Score SET score=${teamRedScore} WHERE map_id=${row.id} AND team_id=${teamRedId}`);
          }
        });
      });
    } catch (e) {
      nodecg().log.error(e);
    }
  });
});
