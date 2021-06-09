<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="text-white"
        :to="{ name: 'home'}">Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <a class="px-2 text-white"
              href="#"
              v-if="!isLogedIn"
              @click.prevent="toggleAuthModel">Login / Register</a>
            <a class="px-2 text-white"
            v-else
            href="#"
            @click.prevent="logout">Logout</a>
          </li>
          <li v-if="isLogedIn">
            <router-link
              class="px-2 text-white"
              :to="{ name: 'manage'}">
              Manage
            </router-link>
          </li>
          <li>
            <router-link
                class="px-2 text-white"
                :to="{ name: 'about'}">About
            </router-link>
          </li>

        </ul>
      </div>
    </nav>
  </header>
</template>

<script>

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'app-header',
  computed: {
    ...mapState(['isLogedIn']),
  },
  methods: {
    ...mapMutations(['toggleAuthModel']),
    logout() {
      const { requiresAuth } = this.$router.currentRoute.value.meta;
      this.$store.dispatch('logoutUser');
      if (requiresAuth) this.$router.push({ name: 'home' });
    },
  },
};

</script>
