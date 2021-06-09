<template>
    <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <AppUpload ref="upload"
            @newUpload="notifyUploadedSongs"
            @uploadStarted="isUploading = true"
            @uploadCompleted="isUploading = false"
          />
        </div>
      </div>
      <div class="col-span-2">
        <!-- uploaded songs list and way to edit them -->
        <UploadedSongs ref="uploadedSongsComp"/>
      </div>
    </div>
  </section>
</template>

<script>

import AppUpload from '@/components/Upload.vue';
import UploadedSongs from '@/components/UploadedSongs.vue';

export default {
  name: 'Manage',
  data() {
    return {
      isUploading: false,
    };
  },
  components: {
    AppUpload,
    UploadedSongs,
  },
  methods: {
    notifyUploadedSongs(data) {
      this.$refs.uploadedSongsComp.newSongUploaded(data);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isUploading) {
      const res = window.confirm('Are you sure you want to leave');
      if (res) {
        this.$refs.upload.cancelAllTasks();
        next();
      }
    } else {
      next();
    }
  },
};

</script>
