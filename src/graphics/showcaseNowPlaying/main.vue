<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';

class Replicants {
  public static currentMap = useReplicant<string>('currentMap', 'wah2023', {
    defaultValue: '...',
  });

  public static currentPoolCode = useReplicant<string>(
    'currentPoolCode',
    'wah2023',
    {
      defaultValue: '...',
    },
  );

  public static currentPoolString = useReplicant<string>(
    'currentPoolString',
    'wah2023',
    {
      defaultValue: '...',
    },
  );
}

</script>

<template>
  <div id="container">
    <p class="mapdata" id="map">
      {{ Replicants.currentMap?.data }}
    </p>
    <p class="mapdata" id="pool">
      {{ Replicants.currentPoolString?.data }}
    </p>
  </div>
</template>
