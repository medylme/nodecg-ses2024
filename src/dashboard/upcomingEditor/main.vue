<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { ref } from 'vue';
import moment from 'moment';

/*
// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema;

// Accessing normal types.
const exampleType: ExampleType = { exampleProperty: 'exampleString' };
*/

const upcomingTitle = useReplicant<string>('upcoming-title', 'wah2023', {
  defaultValue: '',
});
if (upcomingTitle === undefined) {
  throw new Error('upcomingTitle is undefined');
}
const upcomingTitleRef = ref(upcomingTitle.data);

const upcomingTime = useReplicant<number>('upcoming-time', 'wah2023', {
  defaultValue: Date.now(),
});
if (upcomingTime === undefined) {
  throw new Error('upcomingTime is undefined');
}
const upcomingTimeRef = ref(upcomingTime.data);
const upcomingTimeRefString = ref(moment(upcomingTime.data).format('YYYY-MM-DD HH:mm:ss'));

function saveToProgram() {
  if (upcomingTitle === undefined || upcomingTime === undefined) {
    return;
  }
  upcomingTitle.data = upcomingTitleRef.value;
  upcomingTitle.save();
  upcomingTime.data = upcomingTimeRef.value;
  upcomingTime.save();
}

</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <p>Current Title: <span class="text-bold">{{ upcomingTitle.data }}</span></p>
    <p>Current Countdown Time: <span class="text-bold">{{ upcomingTimeRefString }}</span></p>
    <div class="flex flex-col gap-2 m-8">
      <QInput filled v-model="upcomingTitleRef" label="Title" />
      <QInput filled v-model="upcomingTimeRef" label="Countdown Time (Millis)" />
    </div>
    <QBtn color="red" label="Save to Program" @click="saveToProgram()" />
  </div>
</template>
