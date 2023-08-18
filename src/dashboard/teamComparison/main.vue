<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { Ref, ref } from 'vue';

interface Team {
  id: number;
  name: string;
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

// Current Comparisons
const currentComparisonsReplicant = useReplicant<Team[]>(
  'currentComparisons',
  'wah2023',
  {
    defaultValue: [
      currentTeamsReplicant.value?.find((team) => team.id === 1) as Team,
      currentTeamsReplicant.value?.find((team) => team.id === 2) as Team,
    ],
  },
);
if (currentComparisonsReplicant === undefined || currentComparisonsReplicant.data === undefined) {
  throw new Error('currentComparisonsReplicant is undefined');
}
const teamBlueSelectionName = ref('');
const teamRedSelectionName = ref('');
const teamBlueName = ref(currentComparisonsReplicant.data[0]?.name);
const teamRedName = ref(currentComparisonsReplicant.data[1]?.name);

function updateTeams(blueTeamName: string, redTeamName: string) {
  if (currentComparisonsReplicant === undefined) {
    throw new Error('currentComparisonsReplicant is undefined');
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

  teamBlueName.value = currentComparisonsReplicant.data[0]?.name;
  teamRedName.value = currentComparisonsReplicant.data[1]?.name;
}

</script>

<template>
  <div class="flex justify-center items-center">
    <section class="flex flex-col">
      <p>Current Team Blue: <span class="text-bold">{{ teamBlueName }}</span></p>
      <p>Current Team Red: <span class="text-bold">{{ teamRedName }}</span></p>
    </section>
    <section class="q-pa-md flex flex-row gap-4 items-end justify-center">
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
