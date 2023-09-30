<script setup lang="ts">
import { Team } from '@nodecg-vue-ts-template/types/osu';
import { Pools } from '@nodecg-vue-ts-template/types/schemas';
import { useReplicant } from 'nodecg-vue-composable';
import { onMounted, ref } from 'vue';

// Pools
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

// Current Pool
const currentComparisonPoolReplicant = useReplicant<string>(
  'currentComparisonPool',
  'wah2023',
);

// Current Comparison
const currentComparisonsReplicant = useReplicant<Team[]>(
  'currentComparisons',
  'wah2023',
);

const teamBlueName = ref('');
const teamRedName = ref('');

function updatePanel() {
  setTimeout(() => {
    if (currentComparisonsReplicant === undefined || currentComparisonsReplicant.data === undefined) {
      throw new Error('currentComparisonsReplicant is undefined');
    }

    teamBlueName.value = currentComparisonsReplicant.data[0]?.name;
    teamRedName.value = currentComparisonsReplicant.data[1]?.name;

    nodecg.log.info('Comparison Teams Updated', currentComparisonsReplicant.data);
  }, 1000);
}

nodecg.listenFor('updateComparisonTeams', () => {
  updatePanel();
});

onMounted(() => {
  updatePanel();
});

</script>

<template>
  <div id="container" class="w-full h-full flex flex-col items-center justify-center text-xl m-12">
    <h1 class="text-3xl">
      <span class="text-bold">{{ teamBlueName }}</span> vs <span class="text-bold">{{ teamRedName }}</span>
    </h1>
    <h2>{{ currentComparisonPoolReplicant?.data }}</h2>
  </div>
</template>
