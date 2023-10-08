<script setup lang="ts">
import { Team } from '@nodecg-vue-ts-template/types/schemas';
import { useReplicant } from 'nodecg-vue-composable';
import { Ref, ref } from 'vue';

const teamBlueSelection = ref('');
const teamRedSelection = ref('');
const matchUrl = ref('');
const teamArray: Ref<string[]> = ref([]);

class Replicants {
  public static currentTeams = useReplicant<Team[]>('currentTeamsReplicant', 'wah2023');

  public static refreshTeams() {
    const newArray: string[] = [];
    this.currentTeams?.data?.forEach((team) => {
      newArray.push(team.name);
    });

    teamArray.value = newArray;
  }
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
    teamBlueId: Replicants.currentTeams?.data?.find((team) => team.name === teamBlueSelection.value)?.id,
    teamRedName: teamRedSelection.value,
    teamRedId: Replicants.currentTeams?.data?.find((team) => team.name === teamRedSelection.value)?.id,
  });
}

setTimeout(() => {
  Replicants.refreshTeams();
}, 1000);

</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <div class="q-pa-md flex flex-row gap-4 items-center justify-center">
      <QInput class="w-64" filled v-model="matchUrl" label="MP ID" />
      <div class="q-pa-md flex flex-row gap-4">
        <QSelect class="w-36" @update:modelValue="newValue => teamRedSelection = newValue" v-model="teamRedSelection"
          :options="teamArray" label="Team Red" />
        <QSelect class="w-36" @update:modelValue="newValue => teamBlueSelection = newValue" v-model="teamBlueSelection"
          :options="teamArray" label="Team Blue" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <QBtn color="red" label="Save to Database" @click="saveToDatabase" />
    </div>
    <footer class="mt-8 text-slate-200 italic">Note: Don't touch unless your name is dyl {{ ":^)" }}</footer>
  </div>
</template>
