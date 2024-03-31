<!-- eslint-disable operator-linebreak -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket';
import Vue3Odometer from 'vue3-odometer';
import 'odometer/themes/odometer-theme-default.css';
import { ref } from 'vue';

// values
const overlayVisible = ref(false);

const k1Pressed = ref(false);
const k2Pressed = ref(false);
const m1Pressed = ref(false);
const m2Pressed = ref(false);

const k1Value = ref(0);
const k2Value = ref(0);
const m1Value = ref(0);
const m2Value = ref(0);

// gosumemory websocket
const socket = new ReconnectingWebSocket('ws://localhost:24050/ws');
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // hide menu if not playing
  if (data.menu.state !== 2) {
    overlayVisible.value = false;
    return;
  }

  if (data.gameplay.keyOverlay !== undefined) {
    k1Pressed.value = data.gameplay.keyOverlay.k1.isPressed;
    k1Value.value = data.gameplay.keyOverlay.k1.count;

    k2Pressed.value = data.gameplay.keyOverlay.k2.isPressed;
    k2Value.value = data.gameplay.keyOverlay.k2.count;

    m1Pressed.value = data.gameplay.keyOverlay.m1.isPressed;
    m1Value.value = data.gameplay.keyOverlay.m1.count;

    m2Pressed.value = data.gameplay.keyOverlay.m2.isPressed;
    m2Value.value = data.gameplay.keyOverlay.m2.count;
  }

  if (
    data.gameplay.combo !== undefined &&
    data.gameplay.accuracy !== undefined
  ) {
    if (data.gameplay.combo.current === 0 && data.gameplay.accuracy === 0) {
      overlayVisible.value = false;
    } else {
      overlayVisible.value = true;
    }
  }
};
</script>

<template>
  <div
    id="container"
    class="column q-ma-lg items-center justify-center transition-all duration-[50ms]0 ease-in-out"
    :class="{
      'translate-y-0': overlayVisible,
      'translate-y-20': !overlayVisible,
    }"
  >
    <div class="flex gap-2 items-center justify-center">
      <div
        class="flex flex-row gap-2 items-center justify-center bg-[#051372] py-2 px-5 rounded-full"
      >
        <div
          class="flex flex-col items-center justify-center transition-all duration-[50ms]"
          :class="{
            'text-[#ffe000] scale-90': k1Pressed,
            'text-white': !k1Pressed,
          }"
        >
          <p class="text-lg font-bold" v-if="k1Value === 0">K1</p>
          <Vue3Odometer
            v-else
            format="d"
            class="o-text transition-colors duration-200 text-lg font-black"
            :value="k1Value"
          />
          <div
            class="w-[2rem] h-[3px] transition-colors duration-100 rounded-full"
            :class="{
              'bg-[#ffe000]': k1Pressed,
              'bg-white': !k1Pressed,
              '-translate-y-[1px]': k1Value === 0,
              'translate-y-[-2px]': k1Value !== 0,
            }"
          ></div>
        </div>
        <div
          class="flex flex-col items-center justify-center transition-all duration-[50ms]"
          :class="{
            'text-[#ffe000] scale-90': k2Pressed,
            'text-white': !k2Pressed,
          }"
        >
          <p class="text-lg font-bold" v-if="k2Value === 0">K2</p>
          <Vue3Odometer
            v-else
            format="d"
            class="o-text transition-colors duration-200 text-lg font-black"
            :value="k2Value"
          />
          <div
            class="w-[2rem] h-[3px] transition-colors duration-100 rounded-full"
            :class="{
              'bg-[#ffe000]': k2Pressed,
              'bg-white': !k2Pressed,
              '-translate-y-[1px]': k2Value === 0,
              'translate-y-[-2px]': k2Value !== 0,
            }"
          ></div>
        </div>
        <div
          class="flex flex-col items-center justify-center transition-all duration-[50ms]"
          :class="{
            'text-[#ffe000] scale-90': m1Pressed,
            'text-white': !m1Pressed,
          }"
        >
          <p class="text-lg font-bold" v-if="m1Value === 0">M1</p>
          <Vue3Odometer
            v-else
            format="d"
            class="o-text transition-colors duration-200 text-lg font-black"
            :value="m1Value"
          />
          <div
            class="w-[2rem] h-[3px] transition-colors duration-100 rounded-full"
            :class="{
              'bg-[#ffe000]': m1Pressed,
              'bg-white': !m1Pressed,
              '-translate-y-[1px]': m1Value === 0,
              'translate-y-[-2px]': m1Value !== 0,
            }"
          ></div>
        </div>
        <div
          class="flex flex-col items-center justify-center transition-all duration-[50ms]"
          :class="{
            'text-[#ffe000] scale-90': m2Pressed,
            'text-white': !m2Pressed,
          }"
        >
          <p class="text-lg font-bold" v-if="m2Value === 0">M2</p>
          <Vue3Odometer
            v-else
            format="d"
            class="o-text transition-colors duration-200 text-lg font-black"
            :value="m2Value"
          />
          <div
            class="w-[2rem] h-[3px] transition-colors duration-100 rounded-full"
            :class="{
              'bg-[#ffe000]': m2Pressed,
              'bg-white': !m2Pressed,
              '-translate-y-[1px]': m2Value === 0,
              'translate-y-[-2px]': m2Value !== 0,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.odometer-ribbon-inner {
  -webkit-transition: -webkit-transform 200ms !important;
  -moz-transition: -moz-transform 200ms !important;
  -ms-transition: -ms-transform 200ms !important;
  -o-transition: -o-transform 200ms !important;
  transition: transform 200ms !important;
}
</style>
