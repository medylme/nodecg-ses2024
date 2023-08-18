/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/indent */
import { Team, Map } from '@nodecg-vue-ts-template/types/osu';
import { get as nodecg } from './util/nodecg';
import { currentTeamsReplicant } from './util/replicants';
// import { exampleReplicant } from './util/replicants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db/wah2023.sqlite3');

const apiKey = process.env.OSU_API_KEY;
if (apiKey === undefined) {
  throw new Error("osu! API key not found! Please set it in the .env file as 'OSU_API_KEY'.");
}

// - INITIALIZATION

if (currentTeamsReplicant === undefined) {
  throw new Error('currentTeamsReplicant is undefined!');
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
if (currentTeamsReplicant === undefined) {
  throw new Error('currentTeamsReplicant is undefined!');
}

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

// - LISTENERS

nodecg().listenFor('saveMatch', async (data, ack) => {
  const matchData = await getMatchData(data.matchId);
  const { teamRedId, teamRedName, teamBlueId, teamBlueName } = data;

  await matchData.games.forEach(async (game: any) => {
    const teamBlueScores: number[] = [];
    const teamRedScores: number[] = [];

    game.scores.forEach((score: any) => {
      if (score.pass === '1') {
        if (score.team === '1') {
          teamBlueScores.push(score.score);
        } else if (score.team === '2') {
          teamRedScores.push(score.score);
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

        db.serialize(() => {
          db.run(`INSERT OR IGNORE INTO Score (team_id, map_id, score) VALUES (${teamBlueId}, ${row.id}, ${teamBlueScore})`);
          db.run(`INSERT OR IGNORE INTO Score (team_id, map_id, score) VALUES (${teamRedId}, ${row.id}, ${teamRedScore})`);
        });
      });
    } catch (e) {
      nodecg().log.error(e);
    }
  });
});
