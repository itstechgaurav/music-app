<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">My Songs</span>
      <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Composition Items -->
      <div v-if="!songs.length">
        No song found. Try uploading some
      </div>
      <div class="border border-gray-200 p-3 mb-4 rounded"
          v-for="song, index in songs" :key="index">
        <div class="" v-if="!song.showEditModel">
          <h4 class="inline-block text-md">{{ song.data.modefied_name }}</h4>
          <button
            @click="deleteSong(index)"
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
            <i class="fa fa-times"></i>
          </button>
          <button
            @click="song.showEditModel = true"
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
        <div v-if="song.showEditModel">
          <form @submit.prevent.stop="updateSong(index)">
            <div class="mb-3">
              <label class="inline-block mb-2">Song Title</label>
              <input type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                  transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Song Title"
                v-model="song.formData.modefied_name"/>
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Genre</label>
              <input type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                  transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Genre"
                v-model="song.formData.genre"/>
            </div>
            <button type="submit" class="py-1.5 px-3 mr-3 rounded text-white bg-green-600">
              Submit
            </button>
            <button
              @click="song.showEditModel = false"
              type="button" class="py-1.5 px-3 rounded text-white bg-gray-600">
              Close
            </button>
          </form>
        </div>
      </div>
      <!-- <div class="border border-gray-200 p-3 mb-4 rounded">
        <div>
          <h4 class="inline-block text-2xl font-bold">Song Name</h4>
          <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
            <i class="fa fa-times"></i>
          </button>
          <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>

import { songsCollection, auth } from '@/includes/firebase';

export default {
  name: 'Uploaded Songs',
  data() {
    return {
      songs: [],
    };
  },
  methods: {
    updateSong(index) {
      const song = this.songs[index];

      songsCollection.doc(song.docId).update(song.formData)
        .then(() => {
          song.data = {
            ...song.data,
            ...song.formData,
          };

          // add notification
          this.$store.dispatch('addNotification', {
            text: 'Song updated successfully',
            type: 'info',
          });
        }).catch(() => {
          this.$store.dispatch('addNotification', {
            text: 'Unable to update the song',
            type: 'danger',
          });
        })
        .finally(() => {
          song.showEditModel = false;
        });
    },
    deleteSong(index) {
      const song = this.songs[index];

      songsCollection.doc(song.docId).delete()
        .then(() => {
          this.$store.dispatch('addNotification', {
            text: 'Song deleted successfully',
            type: 'success',
          });

          // now remove the song from the songs list
          this.songs.splice(index, 1);
        })
        .catch(() => {
          this.$store.dispatch('addNotification', {
            text: 'Unable to delete the song',
            type: 'danger',
          });
        });
    },
    newSongUploaded(doc) {
      this.songs.push({
        docId: doc.id,
        data: doc.data(),
        formData: {
          modefied_name: doc.data().modefied_name,
          genre: doc.data().genre,
        },
        showEditModel: false,
      });
    },
  },
  mounted() {
    songsCollection.where('uid', '==', auth.currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.songs.push({
            docId: doc.id,
            data: doc.data(),
            formData: {
              modefied_name: doc.data().modefied_name,
              genre: doc.data().genre,
            },
            showEditModel: false,
          });
        });
      })
      .catch(console.error);
  },
};
</script>
