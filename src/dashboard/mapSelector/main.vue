<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { ref } from 'vue';
import clone from 'clone';
import { Rounds } from '../../types/osu';

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

class Replicants {
  public static currentPoolStringReplicant = useReplicant<string>(
    'currentPoolString',
    'wah2023',
    {
      defaultValue: 'Qualifiers',
    },
  );

  public static currentPoolCodeReplicant = useReplicant<string>(
    'currentPoolCode',
    'wah2023',
    {
      defaultValue: 'QL',
    },
  );

  public static currentMapReplicant = useReplicant<string>('currentMap', 'wah2023', {
    defaultValue: 'NM1',
  });

  // Save to Program
  public static savePoolMap(pool: string, map: string) {
    if (this.currentPoolCodeReplicant === undefined || this.currentPoolStringReplicant === undefined || this.currentMapReplicant === undefined) {
      return;
    }

    this.currentPoolCodeReplicant.data = clone(pool);
    this.currentPoolCodeReplicant.save();
    this.currentPoolStringReplicant.data = getPoolTitle(pool as Rounds);
    this.currentPoolStringReplicant.save();
    this.currentMapReplicant.data = clone(map);
    this.currentMapReplicant.save();
  }
}

const selectedPoolModel = ref(Replicants.currentPoolCodeReplicant?.data as Rounds);
const selectedPool = ref(Replicants.currentPoolCodeReplicant?.data as Rounds);
const selectedMap = ref(Replicants.currentMapReplicant?.data as string);

</script>

<template>
  <div class="flex items-center justify-center">
    <div class="">
      <p>
        Current Pool: <span class="text-bold">{{ Replicants.currentPoolStringReplicant?.data }}</span>
        <br />
        Current Map: <span class="text-bold">{{ Replicants.currentMapReplicant?.data }}</span>
      </p>
    </div>
    <div class="q-pa-md">
      <QSelect filled @update:modelValue="newValue => selectedPool = newValue.value" v-model="selectedPoolModel"
        :options="poolOptions" label="Pool" stack-label />
      <br />
      <QExpansionItem expand-seperator label="Map (only for showcase overlay)">
        <ul class="column">
          <li v-for="map in pools[selectedPool]" :key="map">
            <QRadio v-model="selectedMap" :val="map" :label="map" />
          </li>
        </ul>
      </QExpansionItem>
    </div>
    <QBtn color="red" label="Save to Program" @click="Replicants.savePoolMap(selectedPool, selectedMap)" />
  </div>
</template>
