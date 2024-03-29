<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';

class Replicants {
  public static currentPoolCode = useReplicant<string>(
    'currentPoolCode',
    'ses2024',
    {
      defaultValue: 'Q',
    },
  );

  public static currentPoolString = useReplicant<string>(
    'currentPoolString',
    'ses2024',
    {
      defaultValue: 'Qualifiers',
    },
  );
}

function getBannerImage(mapSlot: string | undefined): string {
  const imageFileName = `${mapSlot}.png`;
  const imagePath = `../shared/dist/showcase_top/${imageFileName}`;

  return imagePath;
}
</script>

<template>
  <div id="container">
    <img :src="getBannerImage(Replicants.currentPoolCode?.data)" />
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
