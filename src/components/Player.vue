<template>
<div
  v-if="isPlayerReady"
  class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
  <div class="relative">
    <!-- Play/Pause Button -->
    <div class="float-left w-7 h-7 leading-3">
      <button type="button"
        @click="togglePlay"
        >
        <i class="fa text-gray-500 text-xl"
          :class="{
            'fa-play': !isPlaying,
            'fa-pause': isPlaying,
          }"></i>
      </button>
    </div>
    <!-- Current Position -->
    <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
      <span class="player-currenttime">{{ playedTime }}</span>
    </div>
    <!-- Scrub -->
    <div class="float-left w-6 h-7 leading-3 ml-7 mt-2 player-scrub">
      <div class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info">
        <router-link :to="{
          name: 'song',
          params: {
            songId: currentSong.songId,
          }
        }" class="song-title mb-3">{{ currentSong.modefied_name }}</router-link>
      </div>
      <!-- Scrub Container  -->
      <span
        @click="seekSongTo"
        ref="playerSlider"
        class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span class="absolute top-neg-8 text-gray-800 text-lg"
              :style="{ left: (songProgress * 100) + '%'}">
          <i class="fas fa-circle" style="transform: translateX(-50%);"></i>
        </span>
        <!-- Player Progress Bar-->
        <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
              :style="{ width: (songProgress * 100) + '%'}"></span>
      </span>
    </div>
    <!-- Duration -->
    <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
      <span class="player-duration">{{ totalTime }}</span>
    </div>
  </div>
</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'songMeta', 'currentSong', 'songProgress',
      'isPlaying', 'isPlayingCurrent',
      'totalTime', 'playedTime',
      'isPlayerReady',
    ]),
  },
  methods: {
    ...mapActions(['togglePlay', 'seekTo']),
    seekSongTo($event) {
      console.log($event);
      const { x, width } = this.$refs.playerSlider.getBoundingClientRect();
      const clickedAt = $event.clientX - x;
      const pointPercentage = clickedAt / width;
      const timeToSkip = this.$store
        .state.song.totalTime * pointPercentage;
      this.seekTo(timeToSkip);
    },
  },
};

</script>
