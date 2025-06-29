/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ExampleReplicant } from '@nodecg-vue-ts-template/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

// YOU CAN REMOVE THIS RULE WHEN YOU GET MULTIPLE REPLICANTS!
// eslint-disable-next-line import/prefer-default-export
export const exampleReplicant = nodecg().Replicant<ExampleReplicant>('exampleReplicant');

export const currentPoolReplicant = nodecg().Replicant<string>('currentPool', {
  defaultValue: 'Q',
});

export const currentSlotReplicant = nodecg().Replicant<string>('currentSlot', {
  defaultValue: 'AM1',
});
