<!-- eslint-disable operator-linebreak -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { ref } from 'vue';
import clone from 'clone';
import { Rounds } from '../../types/osu';

function getPoolTitle(code: Rounds): string {
  switch (code) {
    case 'Q':
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
  Q: ['AM1', 'AM2', 'AM3', 'AM4', 'TP1', 'TP2', 'TP3', 'RD1', 'RD2', 'RD3'],
  RO16: [
    'AM1',
    'AM2',
    'AM3',
    'AM4',
    'AM5',
    'AM6',
    'TP1',
    'TP2',
    'TP3',
    'TP4',
    'RD1',
    'RD2',
    'RD3',
    'RD4',
    'TB',
  ],
  QF: [
    'AM1',
    'AM2',
    'AM3',
    'AM4',
    'AM5',
    'AM6',
    'TP1',
    'TP2',
    'TP3',
    'TP4',
    'RD1',
    'RD2',
    'RD3',
    'RD4',
    'TB',
  ],
  SF: [
    'AM1',
    'AM2',
    'AM3',
    'AM4',
    'AM5',
    'AM6',
    'AM7',
    'TP1',
    'TP2',
    'TP3',
    'TP4',
    'RD1',
    'RD2',
    'RD3',
    'RD4',
    'TB',
  ],
  F: [
    'AM1',
    'AM2',
    'AM3',
    'AM4',
    'AM5',
    'AM6',
    'AM7',
    'AM8',
    'TP1',
    'TP2',
    'TP3',
    'TP4',
    'TP5',
    'RD1',
    'RD2',
    'RD3',
    'RD4',
    'RD5',
    'TB',
  ],
  GF: [
    'AM1',
    'AM2',
    'AM3',
    'AM4',
    'AM5',
    'AM6',
    'AM7',
    'AM8',
    'TP1',
    'TP2',
    'TP3',
    'TP4',
    'TP5',
    'RD1',
    'RD2',
    'RD3',
    'RD4',
    'RD5',
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
    'ses2024',
    {
      defaultValue: 'Qualifiers',
    },
  );

  public static currentPoolCodeReplicant = useReplicant<string>(
    'currentPoolCode',
    'ses2024',
    {
      defaultValue: 'Q',
    },
  );

  public static currentMapReplicant = useReplicant<string>(
    'currentMap',
    'ses2024',
    {
      defaultValue: 'AM1',
    },
  );

  // Save to Program
  public static savePoolMap(pool: string, map: string) {
    if (
      this.currentPoolCodeReplicant === undefined ||
      this.currentPoolStringReplicant === undefined ||
      this.currentMapReplicant === undefined
    ) {
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

const selectedPoolModel = ref(
  Replicants.currentPoolCodeReplicant?.data as Rounds,
);
const selectedPool = ref(Replicants.currentPoolCodeReplicant?.data as Rounds);
const selectedMap = ref(Replicants.currentMapReplicant?.data as string);
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="">
      <p>
        Current Pool:
        <span class="text-bold">{{
          Replicants.currentPoolStringReplicant?.data
        }}</span>
        <br />
        Current Map:
        <span class="text-bold">{{
          Replicants.currentMapReplicant?.data
        }}</span>
      </p>
    </div>
    <div class="q-pa-md">
      <QSelect
        filled
        @update:modelValue="(newValue) => (selectedPool = newValue.value)"
        v-model="selectedPoolModel"
        :options="poolOptions"
        label="Pool"
        stack-label
      />
      <br />
      <QExpansionItem expand-seperator label="Showcase Slot">
        <ul class="column">
          <li v-for="map in pools[selectedPool]" :key="map">
            <QRadio v-model="selectedMap" :val="map" :label="map" />
          </li>
        </ul>
      </QExpansionItem>
    </div>
    <QBtn
      color="blue"
      label="Apply"
      @click="Replicants.savePoolMap(selectedPool, selectedMap)"
    />
  </div>
</template>
