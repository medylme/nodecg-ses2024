<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';

class Replicants {
  public static currentMap = useReplicant<string>('currentMap', 'ses2024', {
    defaultValue: 'AM1',
  });
}

function getBannerImage(mapSlot: string | undefined): string {
  const imageFileName = `${mapSlot}.png`;
  const imagePath = `../shared/dist/showcase_bottom/${imageFileName}`;

  return imagePath;
}
</script>

<template>
  <div id="container">
    <img :src="getBannerImage(Replicants.currentMap?.data)" />
  </div>
</template>

<style>
#container {
  max-width: 100%;
  overflow: hidden;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: scale-down;
}
</style>
