<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';

// Get replicants
const upcomingTitle = useReplicant<string>('upcoming-title', 'wah2023', {
  defaultValue: '',
});
if (upcomingTitle === undefined) {
  throw new Error('upcomingTitle is undefined');
}

const upcomingTime = useReplicant<number>('upcoming-time', 'wah2023', {
  defaultValue: Date.now(),
});
if (upcomingTime === undefined) {
  throw new Error('upcomingTime is undefined');
}

</script>

<template>
  <article class="flex flex-row absolute bottom-0 left-0 px-12 py-8 w-full">
    <section class="px-6 py-3 bg-waffle flex items-center justify-start grow">
      <h2 class="text-black text-4xl w-fit h-fit">{{ upcomingTitle.data }}</h2>
    </section>
    <section class="flex flex-row">
      <div class="px-6 py-3 bg-white h-fit">
        <p class="text-black uppercase text-5xl">
          <vue-countdown :time="upcomingTime.data" v-slot="{ minutes, seconds }">
            {{ minutes }}:{{ seconds }}
          </vue-countdown>
        </p>
      </div>
    </section>
  </article>
</template>
