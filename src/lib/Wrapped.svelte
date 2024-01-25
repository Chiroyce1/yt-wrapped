<script lang="ts">
  import '../app.css'
  import TopChannels from './components/TopChannels.svelte';
	import type { Days, Stats } from './types';
  import { getStats, year } from './data'
  import Graph from './components/Graph.svelte';

  export let data: any | undefined;

  function totalVideos(days: Days) {
    return Object.values(days).reduce(
      (sum, day) => sum + day.length,
      0
    );
  }

  function average(days: Days, duration: number) {
    const totalVideosWatched = totalVideos(days);
    return parseInt((totalVideosWatched / duration).toLocaleString()).toFixed();
  }

  let days: Days | undefined;
  let stats: Stats | undefined;

  $: if (data) {
	  stats = getStats(data.days);
  }
</script>

{#if data && stats}
  <p class="data title">You watched...</p>
  <p class="data">- a total of <span class="gradient blue">{totalVideos(data.days).toLocaleString()}</span> videos in {year}</p>
  <p class="data">- an average of <span class="gradient yellow">{average(data.days, 365).toLocaleString()}</span> videos in a day</p>
  <p class="data">- an average of <span class="gradient purple">{average(data.days, 12).toLocaleString()}</span> videos in a month</p>
  <p class="data">- a whopping <span class="gradient red">{stats.mostWatchedMonthValue}</span> videos in <span class="gradient yellow">{stats.mostWatchedMonth}</span></p>
  <p class="data">- a monumental <span class="gradient yellow">{stats.mostWatchedDayValue}</span> videos on <span class="gradient red">{stats.mostWatchedDay}</span></p>
  <TopChannels topChannels={data.top} n={20} />

  <br>
  <i><sub>Videos include #shorts but not videos or music played from music.youtube.com</sub></i>
  <br><br><br>
  <Graph {stats} />
{:else}
  <div class="placeholder">
    <p>Your YouTube Wrapped will show up here!</p>
  </div>
{/if}

<style>
  .placeholder {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px dotted var(--fg);
    border-radius: 3px;
    margin-top: 1em;
  }

  p {
    margin: 0;
    font-weight: 300;
  }

  .title {
    margin-top: 1em;
    font-size: 1.8em;
  }

  i {
    color: var(--fg);
  }
</style>