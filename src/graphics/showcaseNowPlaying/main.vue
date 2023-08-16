<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';

// Get replicants
const currentMapReplicant = useReplicant<string>('currentMap', 'wah2023', {
  defaultValue: '...',
});
const currentPoolCodeReplicant = useReplicant<string>(
  'currentPoolCode',
  'wah2023',
  {
    defaultValue: '...',
  },
);
const currentPoolStringReplicant = useReplicant<string>(
  'currentPoolString',
  'wah2023',
  {
    defaultValue: '...',
  },
);
if (currentMapReplicant === undefined || currentPoolCodeReplicant === undefined || currentPoolCodeReplicant.data === undefined || currentPoolStringReplicant === undefined) {
  throw new Error('currentMapReplicant is undefined');
}

</script>

<template>
  <div id="container">
    <p class="mapdata" id="map">
      {{ currentMapReplicant.data }}
    </p>
    <p class="mapdata" id="pool">
      {{ currentPoolStringReplicant.data }}
    </p>
  </div>
</template>
