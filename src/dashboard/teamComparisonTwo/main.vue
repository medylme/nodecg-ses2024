<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { Ref, onMounted, ref } from 'vue';
import { Pools } from '@nodecg-vue-ts-template/types/schemas';
import { Rounds, Team } from '../../types/osu';

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

function getPoolTitle(code: string | undefined): string {
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

class Replicants {
  public static currentTeams = nodecg.Replicant<Team[]>('currentTeamsReplicant');

  public static currentComparisonPool = useReplicant<string>(
    'currentComparisonTwoPool',
    'wah2023',
    {
      defaultValue: 'RO16',
    },
  );

  public static currentComparisons = useReplicant<Team[]>(
    'currentComparisonsTwo',
    'wah2023',
  );
}

const selectedPoolModel = ref(Replicants.currentComparisonPool?.data as Rounds);
const selectedPool = ref(Replicants.currentComparisonPool?.data as Rounds);
const teamBlueName = ref(Replicants.currentComparisons?.data?.[0]?.name);
const teamRedName = ref(Replicants.currentComparisons?.data?.[1]?.name);
const teamArray: Ref<string[]> = ref([]);

const teamBlueSelectionName = ref('');
const teamRedSelectionName = ref('');

function updateTeams(blueTeamName: string, redTeamName: string) {
  if (Replicants.currentComparisons === undefined || Replicants.currentComparisonPool === undefined) {
    return;
  }

  const teamBlue = Replicants.currentTeams.value?.find((team) => team.name === blueTeamName) as Team;
  const teamRed = Replicants.currentTeams.value?.find((team) => team.name === redTeamName) as Team;

  if (teamBlue === teamRed) {
    // eslint-disable-next-line no-alert
    alert('Error: Selected teams are the same!');
    return;
  }

  Replicants.currentComparisons.data = [teamBlue, teamRed];
  Replicants.currentComparisons.save();

  Replicants.currentComparisonPool.data = selectedPool.value;
  Replicants.currentComparisonPool.save();

  teamBlueName.value = Replicants.currentComparisons.data[0]?.name;
  teamRedName.value = Replicants.currentComparisons.data[1]?.name;

  nodecg.sendMessage('updateComparisonTwoTeams', '1');
  nodecg.sendMessage('updateComparisonTwoScores', '1');
}

function refreshTeams() {
  setTimeout(() => {
    if (Replicants.currentTeams.value === undefined) {
      throw new Error('One or more replicants are undefined');
    }

    const newArray: string[] = [];
    Replicants.currentTeams.value.forEach((team) => {
      newArray.push(team.name);
    });

    teamArray.value = newArray;

    teamBlueName.value = Replicants.currentComparisons?.data?.[0].name;
    teamRedName.value = Replicants.currentComparisons?.data?.[1].name;
  }, 1000);
}

onMounted(() => {
  refreshTeams();
});

</script>

<template>
  <div class="flex justify-center items-center">
    <section class="flex flex-col">
      <p>Current Comparison Pool: <span class="text-bold">{{ getPoolTitle(Replicants.currentComparisonPool?.data)
      }}</span></p>
      <br />
      <p>Current Team Red: <span class="text-bold">{{ teamRedName }}</span></p>
      <p>Current Team Blue: <span class="text-bold">{{ teamBlueName }}</span></p>
    </section>
    <section class="q-pa-md flex flex-row gap-4 items-end justify-center">
      <QSelect class="grow" filled @update:modelValue="newValue => selectedPool = newValue.value"
        v-model="selectedPoolModel" :options="poolOptions" label="Comparison Pool" stack-label />
      <div class="q-pa-md flex flex-row gap-4">
        <QSelect class="w-36" v-model="teamRedSelectionName" :options="teamArray" label="Team Red" />
        <QSelect class="w-36" v-model="teamBlueSelectionName" :options="teamArray" label="Team Blue" />
      </div>
    </section>
    <section class="flex flex-row gap-4">
      <QBtn color="blue" label="Apply to Slot 2" @click="updateTeams(teamBlueSelectionName, teamRedSelectionName)" />
    </section>
  </div>
</template>
