<script setup lang="ts">
import { Team } from '@nodecg-vue-ts-template/types/schemas';
import { Ref, ref } from 'vue';

const currentTeamsReplicant = nodecg.Replicant<Team[]>('currentTeamsReplicant');

const teamBlueSelection = ref('');
const teamRedSelection = ref('');
const matchUrl = ref('');

const teamArray: Ref<string[]> = ref([]);
function refreshTeams() {
  const newArray: string[] = [];
  currentTeamsReplicant?.value?.forEach((team) => {
    newArray.push(team.name);
  });

  teamArray.value = newArray;
}

function saveToDatabase() {
  if (teamBlueSelection.value === '' || teamRedSelection.value === '' || matchUrl.value === '') {
    // eslint-disable-next-line no-alert
    alert('Error: One of the fields is empty!');
    return;
  }

  if (teamBlueSelection.value === teamRedSelection.value) {
    // eslint-disable-next-line no-alert
    alert('Error: Selected teams are the same!');
    return;
  }

  nodecg.sendMessage('saveMatch', {
    matchId: matchUrl.value,
    teamBlueName: teamBlueSelection.value,
    teamBlueId: currentTeamsReplicant.value?.find((team) => team.name === teamBlueSelection.value)?.id,
    teamRedName: teamRedSelection.value,
    teamRedId: currentTeamsReplicant.value?.find((team) => team.name === teamRedSelection.value)?.id,
  });
}

</script>

<template>
  <div class="flex justify-center items-center">
    <div class="q-pa-md flex flex-row gap-4 items-center justify-center">
      <QInput class="w-64" filled v-model="matchUrl" label="Match ID" />
      <div class="q-pa-md flex flex-row gap-4">
        <QSelect class="w-36" @update:modelValue="newValue => teamBlueSelection = newValue" v-model="teamBlueSelection"
          :options="teamArray" label="Team Blue" />
        <QSelect class="w-36" @update:modelValue="newValue => teamRedSelection = newValue" v-model="teamRedSelection"
          :options="teamArray" label="Team Red" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <QBtn class="w-fit" color="primary" label="Refresh Teams" @click="refreshTeams" />
      <QBtn color="red" label="Save to Database" @click="saveToDatabase" />
    </div>
  </div>
</template>
