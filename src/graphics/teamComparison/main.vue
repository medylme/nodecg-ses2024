<script setup lang="ts">
import { ComparisonScoreWithCode, ComparisonScores, Team } from '@nodecg-vue-ts-template/types/osu';
import clone from 'clone';
import { useReplicant } from 'nodecg-vue-composable';
import { onMounted, ref } from 'vue';

const pools = {
  QL: [
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

// Current Pool
const currentComparisonPoolReplicant = useReplicant<string>(
  'currentComparisonPool',
  'wah2023',
);

// Current Comparison
const currentComparisonsReplicant = useReplicant<Team[]>(
  'currentComparisons',
  'wah2023',
);

// Current Comparison Scores
const currentComparisonsScoresReplicant = useReplicant<ComparisonScores>('currentComparisonsScores', 'wah2023');

const teamBlueName = ref('');
const teamRedName = ref('');
const comparisonScores = ref<ComparisonScoreWithCode[]>();

function updatePanel() {
  setTimeout(() => {
    if (
      currentComparisonsReplicant === undefined
      || currentComparisonsReplicant.data === undefined
      || currentComparisonsScoresReplicant === undefined
      || currentComparisonsScoresReplicant.data === undefined
      || currentComparisonPoolReplicant === undefined
      || currentComparisonPoolReplicant.data === undefined
    ) {
      throw new Error('currentComparisonsReplicant is undefined');
    }

    teamBlueName.value = currentComparisonsReplicant.data[0]?.name;
    teamRedName.value = currentComparisonsReplicant.data[1]?.name;

    let currentSlots: string[] = [];
    switch (currentComparisonPoolReplicant.data) {
      case 'RO16':
        currentSlots = pools.RO16;
        break;
      case 'QF':
        currentSlots = pools.QF;
        break;
      case 'SF':
        currentSlots = pools.SF;
        break;
      case 'F':
        currentSlots = pools.F;
        break;
      case 'GF':
        currentSlots = pools.GF;
        break;
      default:
        break;
    }

    const currentComparisonsScoresArray: ComparisonScoreWithCode[] = [];
    currentSlots.forEach((slot) => {
      nodecg.log.info(slot);

      if (currentComparisonsScoresReplicant.data === undefined) {
        throw new Error('currentComparisonsScoresReplicant is undefined');
      }

      const currentComparisonScore = clone(currentComparisonsScoresReplicant.data);
      currentComparisonScore[slot] = currentComparisonScore[slot] ?? { teamBlueScore: 0, teamRedScore: 0 };
      currentComparisonsScoresArray.push({
        code: slot,
        ...currentComparisonScore[slot],
      });
    });

    comparisonScores.value = currentComparisonsScoresArray;
    nodecg.log.info(comparisonScores.value);
  }, 1000);
}

nodecg.listenFor('updateComparisonTeams', () => {
  nodecg.sendMessage('updateComparisonScores', '1');

  setTimeout(() => { updatePanel(); }, 1000);
});

onMounted(() => {
  nodecg.sendMessage('updateComparisonScores', '1');
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
  <div id="container" class="w-full h-full flex flex-col items-center justify-center text-xl m-12">
    <h1 class="text-3xl m-2">Best Performance On Last Pool</h1>
    <h3 class="text-4xl text-bold">{{ currentComparisonPoolReplicant?.data }}</h3>
    <ul class="w-full bar-chart mt-8">
      <div class="w-full mb-5">
        <div class="row w-full">
          <div class="text-right font-semibold"> {{ teamRedName }} </div>
          <p class="w-full text-center">vs</p>
          <div class="text-left font-semibold"> {{ teamBlueName }} </div>
        </div>
      </div>
      <li v-for="(match, index) in comparisonScores" :key="index" class="row w-full">
        <div class="team-red-bar font-semibold text-white"
          :style="'width:' + (match.teamRedScore / (match.teamRedScore + match.teamBlueScore) * 50) + '%'">
          {{ getScoreString(match.teamRedScore) }}
        </div>
        <div class="match-code">
          {{ match.code }}
        </div>
        <div class="team-blue-bar font-semibold text-white"
          :style="'width:' + (match.teamBlueScore / (match.teamRedScore + match.teamBlueScore) * 50) + '%'">
          {{ getScoreString(match.teamBlueScore) }}
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
  grid-template-columns: 46% 8% 46%;
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
