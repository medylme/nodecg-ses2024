/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ExampleReplicant } from '@nodecg-vue-ts-template/types/schemas';
import { Team, ComparisonScores } from '@nodecg-vue-ts-template/types/osu';
import { get as nodecg } from './nodecg';
import pools from './pools';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

// YOU CAN REMOVE THIS RULE WHEN YOU GET MULTIPLE REPLICANTS!
// eslint-disable-next-line import/prefer-default-export
export const exampleReplicant = nodecg().Replicant<ExampleReplicant>('exampleReplicant');

export const currentTeamsReplicant = nodecg().Replicant<Team[]>('currentTeamsReplicant');

export const currentComparisonPoolReplicant = nodecg().Replicant<string>('currentComparisonPool', {
  defaultValue: 'RO16',
});

export const currentComparisonsReplicant = nodecg().Replicant<Team[]>('currentComparisons');

export const currentComparisonsScoresReplicant = nodecg().Replicant<ComparisonScores>('currentComparisonsScores');

export const currentPoolsReplicant = nodecg().Replicant<string[]>('currentPools', {
  defaultValue: pools[currentComparisonPoolReplicant.value],
});
