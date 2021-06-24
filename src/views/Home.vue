<template>
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(/assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">{{ $t('home.title') }}</h1>
        <!-- <p class="w-full md:w-8/12 mx-auto">{{ $t('home.subTitle') }}</p> -->
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" />
  </section>

  <!-- songs details -->
  <section class="container mx-auto">
    <input
      type="text"
      placeholder="Look for your music"
      class="input-control p-5 big shadow-sm mb-3"
      v-model="serachQuery">
    <button
      @click="searchSong"
      class="rounded bg-blue-500 p-3 text-white mb-3">Search</button>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon="iconName">
        <span class="card-title text-red-600">Songs</span>
        <!-- Icon -->
      </div>
      <!-- Playlist -->
      <SongsPlaylist :songs="serachQuery.length == 0 ? songs : searchResult"></SongsPlaylist>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>

import { songsCollection } from '@/includes/firebase';
import SongsPlaylist from '@/components/SongsPlaylist.vue';

export default {
  name: 'Home',
  data() {
    return {
      iconName: 'headphones',
      serachQuery: '',
      songs: [],
      searchResult: [],
    };
  },
  components: {
    SongsPlaylist,
  },
  methods: {
    searchSong() {
      this.searchResult = [];
      // const query = new RegExp(this.serachQuery.toLowerCase(), 'gi');
      // serach logic
      songsCollection
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = {
              ...doc.data(),
            };
            const mName = `${data.modefied_name}`;
            const dName = `${data.display_name}`;
            const genre = `${data.genre}`;
            if (mName.toLowerCase().indexOf(this.serachQuery.toLowerCase()) !== -1
                || dName.toLowerCase().indexOf(this.serachQuery.toLowerCase()) !== -1
                || genre.toLowerCase().indexOf(this.serachQuery.toLowerCase()) !== -1) {
              this.searchResult.push({
                docId: doc.id,
                data,
              });
            }
          });
        });
    },
  },
  mounted() {
    songsCollection
      .orderBy('modefied_name', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.songs.push({
            docId: doc.id,
            data: doc.data(),
          });
        });
      });
  },
};

</script>
