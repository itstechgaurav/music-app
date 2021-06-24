<template>
  <ol id="playlist">
    <li
      v-for="song, index in songs" :key="index"
      class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
      duration-300 hover:bg-gray-50">
      <div>
        <router-link
          :to="{
            name: 'song'
            , params: {
              songId: song.docId
            }
          }"
          class="font-regular block text-gray-600">
            {{ song.data.modefied_name }}
        </router-link>
        <span class="text-gray-500 text-xs">uploaded by: {{ song.data.display_name }}</span>
      </div>

      <div class="text-gray-600 text-lg">
        <span class="comments">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.data.comment_count }}
        </span>
      </div>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      required: true,
    },
  },
};
</script>
