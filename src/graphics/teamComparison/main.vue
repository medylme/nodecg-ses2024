<script setup lang="ts">
import { ComparisonScoreWithCode, ComparisonScores, Team } from '@nodecg-vue-ts-template/types/osu';
import { useReplicant } from 'nodecg-vue-composable';
import { onMounted, ref } from 'vue';

const pools = {
  Q: [
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
  GF: [
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
};

const teamBlueName = ref('...');
const teamRedName = ref('...');
const comparisonScores = ref<ComparisonScoreWithCode[]>();

class Replicants {
  public static currentPool: string[] = [];

  public static currentComparisonPool = useReplicant<string>(
    'currentComparisonPool',
    'wah2023',
  );

  public static currentComparisons = useReplicant<Team[]>(
    'currentComparisons',
    'wah2023',
  );

  public static currentComparisonsScores = useReplicant<ComparisonScores>('currentComparisonsScores', 'wah2023');

  public static convertComparisonsScoresToArray(): ComparisonScoreWithCode[] {
    const scoresArray: ComparisonScoreWithCode[] = [];

    // shit way of implementing it but i don't fucking care i've been on this shit for 6 HOURS AND IM GOING CRAZY HAHAHAHAAH!!!!!
    this.currentPool.forEach((slot) => {
      if (this.currentComparisonsScores === undefined || this.currentComparisonsScores.data === undefined) {
        throw new Error('currentComparisonsScoresReplicant is undefined');
      }

      const scoresObject = this.currentComparisonsScores.data;
      nodecg.log.info(scoresObject);
      scoresObject[slot] = scoresObject[slot] ?? { teamBlueScore: 0, teamRedScore: 0 };
      scoresArray.push({
        code: slot,
        ...scoresObject[slot],
      });
    });

    return scoresArray;
  }
}

function updatePanel(): void {
  setTimeout(() => {
    if (
      Replicants.currentComparisons === undefined
      || Replicants.currentComparisons.data === undefined
      || Replicants.currentComparisonsScores === undefined
      || Replicants.currentComparisonsScores.data === undefined
      || Replicants.currentComparisonPool === undefined
      || Replicants.currentComparisonPool.data === undefined
    ) {
      throw new Error('One or more replicants are undefined');
    }

    // Teams
    teamBlueName.value = Replicants.currentComparisons.data[0]?.name || '...';
    teamRedName.value = Replicants.currentComparisons.data[1]?.name || '...';

    // Pool
    switch (Replicants.currentComparisonPool.data) {
      case 'RO16':
        Replicants.currentPool = pools.RO16;
        break;
      case 'QF':
        Replicants.currentPool = pools.QF;
        break;
      case 'SF':
        Replicants.currentPool = pools.SF;
        break;
      case 'F':
        Replicants.currentPool = pools.F;
        break;
      case 'GF':
        Replicants.currentPool = pools.GF;
        break;
      default:
        break;
    }

    // Scores
    comparisonScores.value = Replicants.convertComparisonsScoresToArray();
  }, 1000);
}

nodecg.listenFor('updateComparisonTeams', () => {
  window.location.reload();
});

onMounted(() => {
  updatePanel();
});

function getScoreString(score: number): string {
  if (score === 0) {
    return '-';
  }

  return score.toLocaleString();
}

</script>

<template>
  <div id="container" class="w-full h-full flex flex-col items-center justify-center text-xl m-12 text-white">
    <h1 class="text-6xl m-2 text-bold">Best Performance On Last Pool</h1>
    <ul class="w-full bar-chart mt-8">
      <div class="w-full flex items-center justify-center mt-4 mb-8">
        <h2 class="text-7xl px-4 font-semibold text-center bg-white text-black">Best Team Score in {{
          Replicants.currentComparisonPool?.data
        }}</h2>
      </div>
      <div class="w-full mb-5">
        <div class="row w-full text-6xl">
          <div class="font-semibold w-full flex flex-row justify-end">
            <h3 class="red-color w-fit px-4 py-2 text-right red-background text-white">{{ teamRedName }}</h3>
          </div>
          <h3
            class="w-full text-center bg-white text-black font-semibold flex items-center justify-center border-x-black border-x-[0.5rem]">
            vs</h3>
          <div class="font-semibold w-full flex flex-row justify-right">
            <h3 class="blue-color w-fit px-4 py-2 blue-background text-white">{{ teamBlueName }}</h3>
          </div>
        </div>
      </div>
      <li v-for="(match, index) in comparisonScores" :key="index" class="row w-3/4">
        <div class="team-red-bar font-semibold text-Fwhite text-4xl"
          :style="'width:' + (Math.max(match.teamRedScore / (4000000) * 90, 8)) + '%'">
          <p class="px-1 rounded-xl w-fit">{{ getScoreString(match.teamRedScore) }}</p>
        </div>
        <div
          class="match-code text-[2.5rem] font-bold text-black bg-white border-x-black border-x-[0.5rem] flex items-center justify-center">
          {{ match.code }}
        </div>
        <div class="team-blue-bar font-semibold text-white text-4xl"
          :style="'width:' + (Math.max(match.teamBlueScore / (4000000) * 75, 8)) + '%'">
          <p class="px-1 rounded-xl w-fit">{{ getScoreString(match.teamBlueScore) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
* {
  font-family: "Torus Pro";
}

.bar-chart {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-content: center;
  grid-column: span 3;
}

.row {
  font-family: "Torus Pro SemiBold";
  font-size: 24px;
  width: 90%;
  margin: 10px auto;
  display: grid;
  grid-template-columns: 45% 11% 45%;
}

.red-color {
  color: hsl(360, 90%, 60%);
}

.blue-color {
  color: hsl(240, 100%, 66%);
}

.red-background {
  background-color: hsl(360, 90%, 60%);
}

.blue-background {
  background-color: hsl(240, 100%, 66%);
}

.team-red-bar {
  background: hsl(360, 90%, 60%);
  font-family: "Torus Pro";
  font-size: 21px;
  padding: 7px;
  margin: 0px 0px 0px auto;
  text-align: right;
}

.team-blue-bar {
  background: hsl(240, 100%, 66%);
  font-family: "Torus Pro";
  font-size: 21px;
  padding: 7px;
  margin: 0px auto 0px 0px;
}

.match-code {
  text-align: center;
  flex-grow: 1;
}
</style>
