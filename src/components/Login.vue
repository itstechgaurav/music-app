<template>
  <vee-form
      :validation-schema="loginSchema"
      @submit="loginUser"
    >
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          class="input-control"
          placeholder="Enter email"
          name="email"
        />
        <ErrorMessage name="email"/>
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          type="password"
          class="input-control"
          placeholder="Enter password"
          name="password"
        />
        <ErrorMessage name="password"/>
      </div>
      <button type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
          hover:bg-purple-700">
        Submit
      </button>
    </vee-form>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  data() {
    return {
      loginSchema: {
        email: 'required|min:3|max:50|email',
        password: 'required:min:5|max:100',
      },
    };
  },
  methods: {
    ...mapActions(['loginUser']),
  },
};

</script>
