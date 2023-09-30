<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { Ref, ref } from 'vue';
import { Pools } from '@nodecg-vue-ts-template/types/schemas';
import { Rounds } from '../../types/osu';

interface Team {
  id: number;
  name: string;
}

function getPoolTitle(code: Rounds): string {
  switch (code) {
    case 'QL':
      return 'Qualifiers';
    case 'RO16':
      return 'Round of 16';
    case 'QF':
      return 'Quarterfinals';
    case 'SF':
      return 'Semifinals';
    case 'F':
      return 'Finals';
    case 'GF':
      return 'Grand Finals';
    default:
      return 'Unknown';
  }
}

// Get Teams
const currentTeamsReplicant = nodecg.Replicant<Team[]>('currentTeamsReplicant');
const teamArray: Ref<string[]> = ref([]);
function refreshTeams() {
  if (currentTeamsReplicant.value === undefined) {
    throw new Error('currentTeamsReplicant is undefined');
  }

  const newArray: string[] = [];
  currentTeamsReplicant.value.forEach((team) => {
    newArray.push(team.name);
  });

  teamArray.value = newArray;
}

// Current Pool Code
const currentComparisonPoolReplicant = useReplicant<string>(
  'currentComparisonPool',
  'wah2023',
  {
    defaultValue: 'Qualifiers',
  },
);

const pools = {
  QL: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'TB',
  ],
  RO16: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'NM6',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'FM1',
    'FM2',
    'TB',
  ],
  QF: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'FM1',
    'FM2',
    'TB',
  ],
  SF: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'NM6',
    'NM7',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'DT4',
    'FM1',
    'FM2',
    'FM3',
    'TB',
  ],
  F: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'NM6',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'DT4',
    'FM1',
    'FM2',
    'FM3',
    'TB',
  ],
  GF: [
    'NM1',
    'NM2',
    'NM3',
    'NM4',
    'NM5',
    'NM6',
    'HD1',
    'HD2',
    'HD3',
    'HR1',
    'HR2',
    'HR3',
    'DT1',
    'DT2',
    'DT3',
    'DT4',
    'FM1',
    'FM2',
    'FM3',
    'TB',
  ],
};

const poolOptions = Object.keys(pools).map((pool) => ({
  label: pool,
  value: pool,
}));
const selectedPoolModel = ref(currentComparisonPoolReplicant?.data as Rounds);
const selectedPool = ref(currentComparisonPoolReplicant?.data as Rounds);

// Current Comparisons
const currentComparisonsReplicant = useReplicant<Team[]>(
  'currentComparisons',
  'wah2023',
);

const teamBlueSelectionName = ref('');
const teamRedSelectionName = ref('');
const teamBlueName = ref(currentComparisonsReplicant?.data?.[0]?.name);
const teamRedName = ref(currentComparisonsReplicant?.data?.[1]?.name);

function updateTeams(blueTeamName: string, redTeamName: string) {
  if (currentComparisonsReplicant === undefined || currentComparisonPoolReplicant === undefined) {
    return;
  }

  const teamBlue = currentTeamsReplicant.value?.find((team) => team.name === blueTeamName) as Team;
  const teamRed = currentTeamsReplicant.value?.find((team) => team.name === redTeamName) as Team;

  if (teamBlue === teamRed) {
    // eslint-disable-next-line no-alert
    alert('Error: Selected teams are the same!');
    return;
  }

  currentComparisonsReplicant.data = [teamBlue, teamRed];
  currentComparisonsReplicant.save();

  currentComparisonPoolReplicant.data = getPoolTitle(selectedPool.value as Rounds);
  currentComparisonPoolReplicant.save();

  teamBlueName.value = currentComparisonsReplicant.data[0]?.name;
  teamRedName.value = currentComparisonsReplicant.data[1]?.name;

  nodecg.sendMessage('updateComparisonTeams', '1');
}

</script>

<template>
  <div class="flex justify-center items-center">
    <section class="flex flex-col">
      <p>Current Comparison Pool: <span class="text-bold">{{ currentComparisonPoolReplicant?.data }}</span></p>
      <p>Current Team Blue: <span class="text-bold">{{ teamBlueName }}</span></p>
      <p>Current Team Red: <span class="text-bold">{{ teamRedName }}</span></p>
    </section>
    <section class="q-pa-md flex flex-row gap-4 items-end justify-center">
      <QSelect class="grow" filled @update:modelValue="newValue => selectedPool = newValue.value"
        v-model="selectedPoolModel" :options="poolOptions" label="Comparison Pool" stack-label />
      <div class="q-pa-md flex flex-row gap-4">
        <QSelect class="w-36" v-model="teamBlueSelectionName" :options="teamArray" label="Team Blue" />
        <QSelect class="w-36" v-model="teamRedSelectionName" :options="teamArray" label="Team Red" />
      </div>
    </section>
    <section class="flex flex-row gap-4">
      <QBtn class="w-fit" color="primary" label="Refresh Teams" @click="refreshTeams" />
      <QBtn color="red" label="Save to Program" @click="updateTeams(teamBlueSelectionName, teamRedSelectionName)" />
    </section>
  </div>
</template>
