<script setup lang="ts">
import { Configschema } from '@nodecg-vue-ts-template/types/schemas';
import { useReplicant } from 'nodecg-vue-composable';
import { ref } from 'vue';
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

/*
// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema;

// Accessing normal types.
const exampleType: ExampleType = { exampleProperty: 'exampleString' };
*/

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

// Current Pool String
const currentPoolStringReplicant = useReplicant<string>(
  'currentPoolString',
  'wah2023',
  {
    defaultValue: 'Qualifiers',
  },
);

// Current Pool Code
const currentPoolCodeReplicant = useReplicant<string>(
  'currentPoolCode',
  'wah2023',
  {
    defaultValue: 'QL',
  },
);
if (currentPoolCodeReplicant === undefined) {
  throw new Error('currentPoolReplicant is undefined');
}
const poolOptions = Object.keys(pools).map((pool) => ({
  label: pool,
  value: pool,
}));
const selectedPoolModel = ref(currentPoolCodeReplicant.data as Rounds);
const selectedPool = ref(currentPoolCodeReplicant.data as Rounds);

// Current Map
const currentMapReplicant = useReplicant<string>('currentMap', 'wah2023', {
  defaultValue: 'NM1',
});
if (currentMapReplicant === undefined) {
  throw new Error('currentMapReplicant is undefined');
}
const selectedMap = ref(currentMapReplicant?.data as string);

// Save to Program
function saveToProgram(pool: string, map: string) {
  if (currentMapReplicant === undefined) {
    throw new Error('currentMapReplicant is undefined');
  }
  if (currentPoolCodeReplicant === undefined) {
    throw new Error('currentPoolReplicant is undefined');
  }
  if (currentPoolStringReplicant === undefined) {
    throw new Error('currentPoolStringReplicant is undefined');
  }
  currentPoolCodeReplicant.data = pool;
  currentPoolCodeReplicant.save();
  currentPoolStringReplicant.data = getPoolTitle(pool as Rounds);
  currentPoolStringReplicant.save();
  currentMapReplicant.data = map;
  currentMapReplicant.save();
}
</script>

<template>
  <div class="column">
    <div>
      <p>
        Current Pool: <span class="text-bold">{{ currentPoolStringReplicant?.data }}</span>
        <br />
        Current Map: <span class="text-bold">{{ currentMapReplicant.data }}</span>
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
    <QBtn color="red" label="Save to Program" @click="saveToProgram(selectedPool, selectedMap)" />
  </div>
</template>
