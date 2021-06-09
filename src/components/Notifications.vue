<template>
  <div id="notifcationContainer" class="fixed top-5 right-5 z-50">
    <div
            v-for="notification, index in getNotifications" :key="index"
            class="px-6 py-4 border-0 rounded relative mb-4 bg-emerald-500"
            :class="styledNotification(notification).style">
        <span class="text-xl inline-block mr-5 align-middle">
          <i :class="styledNotification(notification).icon" />
        </span>
        <span class="inline-block align-middle mr-8">
          <p class="capitalize">
            {{ notification.text }}
          </p>
        </span>
        <button
                @click="removeNotification(notification)"
                class="absolute bg-transparent text-2xl font-semibold
                leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
          <span>×</span>
        </button>
      </div>
  </div>
</template>

<script>

import { mapMutations, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getNotifications']),
  },
  methods: {
    ...mapMutations(['removeNotification']),
    styledNotification(notification) {
      let style = '';
      let icon = '';
      if (notification.type === 'success') {
        style = 'bg-green-500 text-white';
        icon = 'fas fa-check';
      } else if (notification.type === 'danger') {
        style = 'bg-red-500 text-white';
        icon = 'fas fa-exclamation-triangle';
      } else if (notification.type === 'info') {
        style = 'bg-blue-500 text-white';
        icon = 'fas fa-bell';
      }
      return { style, icon };
    },
  },
};
</script>
