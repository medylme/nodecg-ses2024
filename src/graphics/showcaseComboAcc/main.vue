<!-- eslint-disable operator-linebreak -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket';
import Vue3Odometer from 'vue3-odometer';
import 'odometer/themes/odometer-theme-default.css';
import { ref } from 'vue';

// values
const overlayVisible = ref(false);

const currentCombo = ref(0);
const currentAccWhole = ref(0);
const currentAccDecimalOne = ref(0);
const currentAccDecimalTwo = ref(0);

// gosumemory websocket
const socket = new ReconnectingWebSocket('ws://localhost:24050/ws');
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // hide menu if not playing
  if (data.menu.state !== 2) {
    overlayVisible.value = false;
    return;
  }

  if (data.gameplay.combo !== undefined) {
    currentCombo.value = data.gameplay.combo.current;
  }
  if (data.gameplay.accuracy !== undefined) {
    const stringValue = data.gameplay.accuracy.toString();
    if (data.gameplay.accuracy === 100) {
      currentAccWhole.value = 100;
      currentAccDecimalOne.value = 0;
      return;
    }
    if (data.gameplay.accuracy === 0) {
      currentAccWhole.value = 0;
      currentAccDecimalOne.value = 0;
      return;
    }

    const split = stringValue.split('.');
    const whole = parseInt(split[0], 10);
    currentAccWhole.value = whole;

    const decimalString = split[1];
    if (decimalString) {
      // has decimals
      currentAccDecimalOne.value = parseInt(decimalString[0], 10);
      if (decimalString.length === 1) {
        currentAccDecimalTwo.value = 0;
      } else {
        currentAccDecimalTwo.value = parseInt(decimalString[1], 10);
      }
    } else {
      // no decimals
      currentAccDecimalOne.value = 0;
      currentAccDecimalTwo.value = 0;
    }
  }

  if (currentCombo.value === 0 && currentAccWhole.value === 0) {
    overlayVisible.value = false;
  } else {
    overlayVisible.value = true;
  }
};
</script>

<template>
  <div
    id="container"
    class="flex items-center justify-center transition-all duration-1000 ease-in-out"
    :class="{
      'translate-y-4': overlayVisible,
      '-translate-y-20': !overlayVisible,
    }"
  >
    <div class="flex flex-row gap-4 items-center justify-center">
      <div
        class="flex flex-row gap-1 items-center justify-center bg-[#051372] py-4 px-5 rounded-full text-white text-3xl font-black"
      >
        <Vue3Odometer
          format="d"
          class="o-text transition-colors duration-200"
          :value="currentCombo"
        />
        <p>x</p>
      </div>
      <div
        class="flex flex-row gap-1 items-center justify-center bg-[#051372] py-4 px-5 rounded-full text-white text-3xl font-black"
      >
        <div class="flex flex-row items-center justify-center">
          <Vue3Odometer
            format="d"
            class="o-text transition-colors duration-200"
            :value="currentAccWhole"
          />
          <div
            class="flex flex-row items-start justify-center"
            :class="{
              hidden: currentAccWhole === 100 || currentAccWhole === 0,
            }"
          >
            <p>.</p>
            <Vue3Odometer
              format="d"
              class="o-text transition-colors duration-200"
              :value="currentAccDecimalOne"
            />
            <Vue3Odometer
              format="d"
              class="o-text transition-colors duration-200"
              :value="currentAccDecimalTwo"
            />
          </div>
        </div>
        <p>%</p>
      </div>
    </div>
  </div>
</template>

<style>
.invis {
  opacity: 0;
}
.odometer-ribbon-inner {
  -webkit-transition: -webkit-transform 200ms !important;
  -moz-transition: -moz-transform 200ms !important;
  -ms-transition: -ms-transform 200ms !important;
  -o-transition: -o-transform 200ms !important;
  transition: transform 200ms !important;
}
</style>
