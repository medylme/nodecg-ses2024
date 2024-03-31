<!-- eslint-disable operator-linebreak -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket';
import Vue3Odometer from 'vue3-odometer';
import 'odometer/themes/odometer-theme-default.css';
import { ref } from 'vue';

// values
const replayerName = ref('...');
const mods = ref('...');
const amount300 = ref(0);
const amount100 = ref(0);
const amount50 = ref(0);
const misses = ref(0);
const maxcombo = ref(0);
const acc = ref(0);
const score = ref(0);
const scoreV1String = ref('');

// gosumemory websocket
const socket = new ReconnectingWebSocket('ws://localhost:24050/ws');
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // if playing, ignore
  if (data.menu.state !== 7) {
    return;
  }

  if (data.resultsScreen.name !== undefined) {
    replayerName.value = data.resultsScreen.name;
  } else {
    replayerName.value = '...';
  }
  if (data.resultsScreen.mods.str !== undefined) {
    if (data.resultsScreen.mods.str.length > 8) {
      mods.value = '...';
      return;
    }

    // remove V2 and NF from mods
    const formattedString = data.resultsScreen.mods.str
      .replace('V2', '')
      .replace('NF', '');

    if (formattedString === '') {
      mods.value = 'NM';
    } else {
      mods.value = formattedString;
    }
  } else {
    mods.value = '...';
  }
  if (data.resultsScreen.maxCombo !== undefined) {
    maxcombo.value = data.resultsScreen.maxCombo;
  }
  if (data.resultsScreen.score !== undefined) {
    score.value = data.resultsScreen.score;
  }
  if (data.resultsScreen['300'] !== undefined) {
    amount300.value = data.resultsScreen['300'];
  }
  if (data.resultsScreen['100'] !== undefined) {
    amount100.value = data.resultsScreen['100'];
  }
  if (data.resultsScreen['50'] !== undefined) {
    amount50.value = data.resultsScreen['50'];
  }
  if (data.resultsScreen['0'] !== undefined) {
    misses.value = data.resultsScreen['0'];

    // calculate acc
    const accFormulaTop =
      300 * amount300.value + 100 * amount100.value + 50 * amount50.value;
    const accFormulaBottom =
      300 * (amount300.value + amount100.value + amount50.value + misses.value);
    const accFormula = (accFormulaTop / accFormulaBottom) * 100;
    acc.value = Number(accFormula.toFixed(2));
  }
  if (!data.resultsScreen.mods.str.includes('V2')) {
    scoreV1String.value = '(V1)';
  } else {
    scoreV1String.value = '';
  }
};
</script>

<template>
  <div id="container" class="flex flex-col items-center justify-center">
    <div class="flex flex-col gap-8 items-center justify-center">
      <div class="flex items-center justify-center">
        <div class="flex flex-col gap-4 items-center justify-center">
          <h3 class="bg-[#051374] text-white text-4xl py-2 px-4 rounded-full">
            replayer
          </h3>
          <p class="text-4xl">{{ replayerName }}</p>
        </div>
      </div>
      <div class="flex flex-row gap-16 items-center justify-center">
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="bg-[#051374] text-white text-3xl py-2 px-4 rounded-full">
            300
          </h4>
          <p class="text-3xl">
            <Vue3Odometer format="d" class="o-text" :value="amount300" />
          </p>
        </div>
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="bg-[#051374] text-white text-3xl py-2 px-4 rounded-full">
            100
          </h4>
          <p class="text-3xl">
            <Vue3Odometer format="d" class="o-text" :value="amount100" />
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-16 items-center justify-center">
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="bg-[#051374] text-white text-3xl py-2 px-4 rounded-full">
            50
          </h4>
          <p class="text-3xl">
            <Vue3Odometer format="d" class="o-text" :value="amount50" />
          </p>
        </div>
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="bg-[#051374] text-white text-3xl py-2 px-4 rounded-full">
            miss
          </h4>
          <p class="text-3xl">
            <Vue3Odometer format="d" class="o-text" :value="misses" />
          </p>
        </div>
      </div>
      <div class="flex gap-8 items-center justify-center">
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="bg-[#051374] text-white text-3xl py-2 px-4 rounded-full">
            combo
          </h4>
          <div class="flex flex-row gap-1">
            <Vue3Odometer
              format="d"
              class="o-text text-3xl"
              :value="maxcombo"
            />
            <p class="text-3xl">x</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4
            class="q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-full"
          >
            acc
          </h4>
          <p class="text-3xl"><Vue3Odometer class="o-text" :value="acc" />%</p>
        </div>
      </div>
      <div class="flex flex-row items-center justify-center gap-8">
        <div class="flex flex-col gap-2 items-center justify-center">
          <h3 class="text-3xl bg-[#051374] text-white py-2 px-4 rounded-full">
            mods
          </h3>
          <p class="text-3xl">{{ mods }}</p>
        </div>
        <div class="flex flex-col gap-2 items-center justify-center">
          <h4 class="text-3xl bg-[#051374] text-white py-2 px-4 rounded-full">
            score {{ scoreV1String }}
          </h4>
          <p class="text-3xl">
            <Vue3Odometer class="o-text" :value="score" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
