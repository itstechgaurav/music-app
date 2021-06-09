<template>
  <Notifications></Notifications>
  <app-header></app-header>

  <router-view></router-view>

  <Player></Player>

  <!-- Auth Modal -->
  <app-auth />
</template>

<script>
import Notifications from '@/components/Notifications.vue';
import appHeader from './components/header.vue';
import appAuth from './components/Auth.vue';
import Player from './components/Player.vue';

export default {
  components: {
    appHeader,
    appAuth,
    Notifications,
    Player,
  },
  created() {
    this.$store.dispatch('initLogin');
  },
};

</script>
