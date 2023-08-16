/* eslint-disable @typescript-eslint/indent */
import type { ExampleType } from '@nodecg-vue-ts-template/types';
import type { Configschema } from '@nodecg-vue-ts-template/types/schemas/configschema';
import { get as nodecg } from './util/nodecg';
import { exampleReplicant } from './util/replicants';

nodecg().log.info('Extension code working!');

const osuBaseUrl = 'https://osu.ppy.sh';
const apiKey = '402208a8e88f4fcd0bffc160d6ddb74c4cdf0ae8';

async function getMatchData(matchId: string) {
  const endpoint = `${osuBaseUrl}/api/get_match?k=${apiKey}&mp=${matchId}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

nodecg().listenFor('saveMatch', async (data, ack) => {
  const matchData = await getMatchData(data.matchId);
  console.log(matchData);
});
