<template>

  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative" v-if="currentSong">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        @click="changeSong(currentSong)"
        type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none">
        <i class="fas" :class="{
            'fa-play': !isPlayingCurrent,
            'fa-pause': isPlayingCurrent,
          }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl mb-2">{{ currentSong.modefied_name  }}</div>
        <div>
          {{ $t('song.source') }}: {{ currentSong.display_name }}
        </div>
        <div v-if="currentSong?.genre?.trim().length">
          Genre: {{ currentSong.genre }}
        </div>
      </div>
    </div>
  </section>
  <Comments v-bind:song="currentSong" v-if="currentSong"></Comments>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import { songsCollection } from '@/includes/firebase';
import Comments from '@/components/Comments.vue';

export default {
  name: 'song',
  data() {
    return {
      currentSong: null,
    };
  },
  created() {
    // get the song
    this.getSong();
  },
  computed: {
    ...mapGetters(['isPlaying', 'isPlayingCurrent']),
    // isPlaying() {
    //   return this.$store.state.isPlaying
    //         && this.$store.state.song.songId === this.currentSong.songId;
    // },
  },
  methods: {
    ...mapActions(['changeSong']),
    getSong() {
      songsCollection
        .doc(this.$route.params.songId)
        .get()
        .then((res) => {
          this.currentSong = res.data();
          this.currentSong.songId = this.$route.params.songId;
        });
    },
  },
  components: {
    Comments,
  },
  beforeUpdate() {
    this.getSong();
  },
};
</script>
