<script setup lang="ts">
import { Configschema } from '@nodecg-vue-ts-template/types/schemas';
import { useReplicant } from 'nodecg-vue-composable';
import { ref } from 'vue';

/*
// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema;

// Accessing normal types.
const exampleType: ExampleType = { exampleProperty: 'exampleString' };
*/

const matchUrl = ref('');

function saveToDatabase() {
  nodecg.sendMessage('saveMatch', {
    matchId: matchUrl.value,
  });
}

</script>

<template>
  <div class="flex justify-center items-center">
    <div class="q-pa-md">
      <QInput filled v-model="matchUrl" label="Match URL" />
    </div>
    <QBtn color="primary" label="Save to Database" @click="saveToDatabase" />
  </div>
</template>
