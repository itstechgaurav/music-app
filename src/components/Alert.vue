<template>
  <div class="px-6 py-4 border-0 rounded relative mb-4 bg-emerald-500"
       :class="getNotification.style">
  <span class="text-xl inline-block mr-5 align-middle">
    <i :class="getNotification.icon" />
  </span>
  <span class="inline-block align-middle mr-8">
     <p class="capitalize">
       <slot></slot>
     </p>
  </span>
  <button
          @click="sendCloseRequest"
          class="absolute bg-transparent text-2xl font-semibold
          leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
    <span>×</span>
  </button>
</div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    getNotification() {
      const { type } = this;
      const noti = {
        icon: '',
        style: '',
      };

      if (type === 'success') {
        noti.icon = 'fas fa-check';
        noti.style = 'bg-green-500 text-white';
      } else if (type === 'danger') {
        noti.style = 'bg-red-500 text-white';
        noti.icon = 'fas fa-exclamation-triangle';
      } else if (type === 'info') {
        noti.style = 'bg-lightBlue-500 text-white';
        noti.icon = 'fas fa-bell';
      }

      return noti;
    },
  },
  methods: {
    sendCloseRequest() {
      this.$emit('close');
    },
  },
};
</script>
