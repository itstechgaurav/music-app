<template>
  <div class="p-6">
  <!-- Upload Dropbox -->
    <label
      class="block w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
        border-gray-400 text-gray-400 transition duration-500 hover:text-white
        hover:bg-green-400 hover:border-green-400 hover:border-solid"
      :class="{ 'bg-green-400 border-green-400 border-solid text-white': isDragging}"
      @drag.prevent.stop=""
      @dragenter.prevent.stop="isDragging = true"
      @dragstart.prevent.stop="isDragging = true"
      @dragover.prevent.stop="isDragging = true"
      @dragend.prevent.stop="isDragging = false"
      @dragleave.prevent.stop="isDragging = false"
      @drop.prevent.stop="droped($event)">
      <input type="file" id="myHiddenFiles" hidden @change="uploadViaInput" multiple>
      <h5>Drop your files here || Click to select files</h5>
    </label>
    <hr class="my-6" />
    <!-- Progess Bars -->
    <div class="relative align-center mb-4 bg-gray-100 rounded-md overflow-hidden"
         v-for="task, index, in tasks" :key="index">
        <!-- File Name -->
        <div class="absolute flex h-full w-full top-0 left-0 overflow-hidden pointer-events-none">
          <div class="transition-all bg-yellow-500 opacity-5
                bg-{{ task.isError ? 'red' : 'yellow'}}-500"
                :style="'width: ' + task.progress + '%'"></div>
        </div>
        <div class="text-sm p-2 mt-2 px-4 content-center flex justify-between">
          <div>
            <i class="fas fa-times" v-if="task.isError"></i>
            <i class="fas fa-spinner animate-spin" v-else-if="!task.isUploaded"></i>
            <i class="fas fa-check" v-else-if="task.isUploaded"></i>
            <span class="ml-3">{{ task.name.substr(0, 30) }}...</span>
          </div>
          <div v-if="!task.isUploaded && !task.isError">
            <div class="cursor-pointer fas fa-pause bg-blue-500 p-2
                      text-white rounded-md mr-2"
                 :class="{'fa-pause': !task.isPause,
                          'fa-play': task.isPause,}"
                  @click="pauseAndPlayUpload(task)"></div>
            <div class="cursor-pointer fas fa-trash
                      bg-red-500 p-2 text-white rounded-md"
                  @click="cancelUpload(task)"></div>
          </div>
        </div>

        <div class="p-2 px-4">
          <!-- Details -->
          <p class="text-sm font-bold"
             :class="{'text-red-500': task.isError}">
            {{ !task.isError ? parseInt(task.progress) + ' %' : 'Error while uploading'}}
          </p>
        </div>
    </div>
  </div>
</template>

<script>

import {
  storage, songsCollection, auth, firestore,
} from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      isDragging: false,
      tasks: [],
    };
  },
  computed: {
    getTasks() {
      return this.tasks;
    },
  },
  methods: {
    uploadViaInput($event) {
      this.droped($event.target, true);
    },
    droped($event, viaInput = false) {
      this.uploadStarted();
      const files = viaInput ? [...$event.files] : [...$event.dataTransfer.files];
      // console.log(files);

      files.forEach((file) => {
        if (file.type === 'audio/mpeg') {
          const rootRef = storage.ref();
          const fileRef = rootRef.child(`/songs/${file.name}`);
          const taskEvt = fileRef.put(file);

          const task = {
            taskId: Date.now(),
            name: file.name,
            isPause: false,
            isError: false,
            isUploaded: false,
            progress: 0,
            taskEvt,
          };

          this.tasks.unshift(task);

          task.taskEvt.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.updateProgress(task.taskId, progress);
          }, async (error) => {
            task.isError = true;
            await this.$store.dispatch('addNotification', {
              type: 'danger',
              text: `Unable to upload Song: (${task.name.substr(1, 20)})`,
              duration: 3000,
            });
            console.log(error);
          }, async () => {
            // upload songs to database
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: taskEvt.snapshot.ref.name,
              modefied_name: taskEvt.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              created_at: firestore.FieldValue.serverTimestamp(),
              updated_at: firestore.FieldValue.serverTimestamp(),
            };

            song.url = await taskEvt.snapshot.ref.getDownloadURL();
            try {
              const response = await songsCollection.add(song);
              const snapshot = await response.get();
              this.$emit('newUpload', snapshot);
            } catch (error) {
              this.$store.dispatch('addNotification', {
                type: 'danger',
                text: 'DB: unable to upload song',
              });
            }
            const taskIndex = this.tasks.findIndex((task_) => task_.taskId === task.taskId);
            if (taskIndex !== -1) {
              this.tasks[taskIndex].isUploaded = true;
            }

            // send request that upload is ended if
            const result = this.tasks.filter(
              (tk) => tk.isUploaded,
            )
              .length === this.tasks.length;
            if (result) {
              this.uploadCompleted();
            }
          });
        }
      });

      this.isDragging = false;
    },
    updateProgress(taskId, progress) {
      const taskIndex = this.tasks.findIndex((task_) => task_.taskId === taskId);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].progress = progress;
      }
    },
    pauseAndPlayUpload(task) {
      if (task.isPause) {
        task.taskEvt.resume();
      } else {
        task.taskEvt.pause();
      }
      // eslint-disable-next-line no-param-reassign
      task.isPause = !task.isPause;
    },
    cancelUpload(task) {
      task.taskEvt.cancel();
      const taskIndex = this.tasks.findIndex((task_) => task_.taskId === task.taskId);
      if (taskIndex !== -1) {
        this.tasks.splice(taskIndex, 1);
      }
    },
    cancelAllTasks() {
      this.tasks.forEach((task) => {
        task.taskEvt.cancel();
      });
    },
    uploadStarted() {
      this.$emit('uploadStarted');
    },
    uploadCompleted() {
      this.$emit('uploadCompleted');
    },
  },
  beforeUnmount() {
    this.cancelAllTasks();
    setTimeout(() => {
      this.tasks = [];
    }, 400);
  },
};
</script>
