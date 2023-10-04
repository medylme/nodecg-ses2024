<script setup lang="ts">
import { Team } from '@nodecg-vue-ts-template/types/schemas';
import { Ref, ref } from 'vue';

const teamBlueSelection = ref('');
const teamRedSelection = ref('');
const matchUrl = ref('');
const teamArray: Ref<string[]> = ref([]);

class Replicants {
  public static currentTeamsReplicant = nodecg.Replicant<Team[]>('currentTeamsReplicant');

  public static refreshTeams() {
    const newArray: string[] = [];
    this.currentTeamsReplicant?.value?.forEach((team) => {
      newArray.push(team.name);
    });

    teamArray.value = newArray;
  }

  public static saveToDatabase() {
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
      teamBlueId: this.currentTeamsReplicant.value?.find((team) => team.name === teamBlueSelection.value)?.id,
      teamRedName: teamRedSelection.value,
      teamRedId: this.currentTeamsReplicant.value?.find((team) => team.name === teamRedSelection.value)?.id,
    });
  }
}

setTimeout(() => {
  Replicants.refreshTeams();
}, 1000);

</script>

<template>
  <div class="flex justify-center items-center">
    <div class="q-pa-md flex flex-row gap-4 items-center justify-center">
      <QInput class="w-64" filled v-model="matchUrl" label="Match ID" />
      <div class="q-pa-md flex flex-row gap-4">
        <QSelect class="w-36" @update:modelValue="newValue => teamRedSelection = newValue" v-model="teamRedSelection"
          :options="teamArray" label="Team Red" />
        <QSelect class="w-36" @update:modelValue="newValue => teamBlueSelection = newValue" v-model="teamBlueSelection"
          :options="teamArray" label="Team Blue" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <QBtn color="red" label="Save to Database" @click="Replicants.saveToDatabase" />
    </div>
  </div>
</template>
