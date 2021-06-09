<template>

  <!-- intro -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(/assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
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
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title text-red-600">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
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
      console.log('Hello', this.serachQuery);
      this.searchResult = [];
      // serach logic
      songsCollection
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            const query = new RegExp(this.serachQuery, 'gi');
            if (data.modefied_name.match(query)
                || data.display_name.match(query)
                || data.genre.match(query)) {
              this.searchResult.push({
                docId: doc.id,
                data,
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    const page = parseInt(this.$route.query.page || '0', 10);
    console.log({ page });
    const songLimit = 10;

    songsCollection
      .orderBy('modefied_name', 'desc')
      .limit(songLimit)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.songs.push({
            docId: doc.id,
            data: doc.data(),
          });
        });
      })
      .catch(console.error);
  },
};

</script>
