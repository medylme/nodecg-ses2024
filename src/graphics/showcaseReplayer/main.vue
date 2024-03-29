<!-- eslint-disable operator-linebreak -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket';
import Vue3Odometer from 'vue3-odometer';
import 'odometer/themes/odometer-theme-default.css';
import { ref } from 'vue';

// values
const replayerName = ref('');
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
  <div id="container" class="column q-ma-lg items-center justify-center">
    <div class="flex gap-2 items-center justify-center">
      <div class="column items-center justify-center">
        <h3
          class="q-mx-none q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
        >
          replayer
        </h3>
        <p class="text-h4">{{ replayerName }}</p>
      </div>
      <div class="row items-start justify-start q-mx-sm">
        <div class="q-mx-lg column items-center justify-center">
          <h4
            class="q-mx-md q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            300
          </h4>
          <p class="text-h4">
            <Vue3Odometer format="d" class="o-text" :value="amount300" />
          </p>
        </div>
        <div class="q-mx-lg column items-center justify-center">
          <h4
            class="q-mx-md q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            100
          </h4>
          <p class="text-h4">
            <Vue3Odometer format="d" class="o-text" :value="amount100" />
          </p>
        </div>
      </div>
      <div class="row items-start justify-start q-mx-sm">
        <div class="q-mx-lg column items-center justify-center">
          <h4
            class="q-mx-md q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            50
          </h4>
          <p class="text-h4">
            <Vue3Odometer format="d" class="o-text" :value="amount50" />
          </p>
        </div>
        <div class="q-mx-lg column items-center justify-center">
          <h4
            class="q-mx-md q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            miss
          </h4>
          <p class="text-h4">
            <Vue3Odometer format="d" class="o-text" :value="misses" />
          </p>
        </div>
      </div>
      <div class="row items-start justify-start q-mx-sm">
        <div class="q-mx-xl column items-center justify-center">
          <h4
            class="q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            combo
          </h4>
          <p class="text-h4">
            <Vue3Odometer format="d" class="o-text" :value="maxcombo" />
          </p>
        </div>
        <div class="q-mx-xl column items-center justify-center">
          <h4
            class="q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
          >
            acc
          </h4>
          <p class="text-h4"><Vue3Odometer class="o-text" :value="acc" />%</p>
        </div>
      </div>
      <div class="column items-center justify-center q-mx-lg">
        <h4
          class="q-mx-none q-my-md bg-[#051374] text-white text-3xl py-2 px-4 rounded-xl"
        >
          score {{ scoreV1String }}
        </h4>
        <p class="text-h4">
          <Vue3Odometer class="o-text" :value="score" />
        </p>
      </div>
    </div>
  </div>
</template>
