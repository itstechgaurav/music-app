<template>
  <div :class="
              ['fixed', 'z-10', 'inset-0',
              'overflow-y-auto',
              { 'hidden' : !isAuthModelOpened, }]"
            id="modal">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center
      sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="toggleAuthModel">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="toggleAuthModel">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition"
                 :class="{
                    'bg-blue-600 text-white hover:text-white' : isLoginTab,
                }"
                 href="#" @click="isLoginTab = true">Login</a>
            </li>
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition"
                :class="{
                    'bg-blue-600 text-white hover:text-white' : !isLoginTab,
                }"
                href="#" @click="isLoginTab = false">Register</a>
            </li>
          </ul>

          <!-- Login Form -->
          <form v-show="isLoginTab">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            </div>
            <button type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </form>
          <!-- Registration Form -->
          <vee-form v-show="!isLoginTab"
                    :initial-values="formData"
                    :validation-schema="schema" @submit="register">
            <!-- Name -->
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <vee-field type="text" name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
                <ErrorMessage name="name" class="text-red-600" />
            </div>
            <!-- Email -->
            <!-- <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Enter Email"
                />
                <ErrorMessage name="email" class="text-red-600" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <vee-field type="number" name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter age" />
                <ErrorMessage name="age" class="text-red-600" />
            </div>

            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field :bails="false" name="password" v-slot="{ field, errors }">
                <input type="password" v-bind="field"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"/>
                  <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                  </div>
              </vee-field>
            </div>

            <div class="mb-3">
              <label class="inline-block mb-2">Confirm Password</label>
              <vee-field type="password" name="confirm_password"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                         duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Confirm Password" />
                <ErrorMessage name="confirm_password" class="text-red-600" />
            </div>

            <div class="mb-3">
              <label class="inline-block mb-2">Country</label>
              <vee-field as="select" name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded">
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
              </vee-field>
              <ErrorMessage name="country" class="text-red-600" />
            </div>

            <div class="mb-3 pl-6">
              <vee-field type="checkbox" name="tos" value="1"
                id="tos_field" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
              <label class="inline-block" for="tos_field">Accept terms of service</label>
              <br>
              <ErrorMessage name="tos" class="text-red-600" />
            </div> -->
            <button type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'app-authModel',
  data() {
    return {
      isLoginTab: true,
      schema: {
        name: 'required|min:3|max:20|alpha_spaces',
        email: 'required|min:3|max:50|email',
        age: 'required|between:18,100|numeric',
        password: 'min:5|max:100|required',
        confirm_password: 'confirmed:@password',
        country: 'required|included:USA,Mexico,Germany',
        tos: 'required',
      },
      formData: {
        country: 'USA',
      },
    };
  },
  computed: {
    ...mapGetters(['isAuthModelOpened']),
  },
  methods: {
    ...mapMutations(['toggleAuthModel']),

    register(value) {
      console.log({ ...value });
    },
  },
};
</script>
