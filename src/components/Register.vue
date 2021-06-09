<template>
  <vee-form :initial-values="formData"
            :validation-schema="schema" @submit="register">
            <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field type="text" name="name" class="input-control"
        placeholder="Enter Name" />
        <ErrorMessage name="name"/>
    </div>
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email" class="input-control"
          placeholder="Enter Email"
        />
        <ErrorMessage name="email"/>
    </div>
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field type="number" name="age"
        class="input-control"
        placeholder="Enter age" />
        <ErrorMessage name="age"/>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" v-slot="{ field, errors }">
        <input type="password" v-bind="field" class="input-control"
        placeholder="Password"/>
          <div class="text-red-600 text-xs" v-for="error in errors" :key="error">
            {{ error }}
          </div>
      </vee-field>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
          type="password" name="confirm_password" class="input-control"
          placeholder="Confirm Password"
      />
        <ErrorMessage name="confirm_password"/>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country" class="input-control">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Ninja">Ninja</option>
      </vee-field>
      <ErrorMessage name="country"/>
    </div>

    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        id="tos_field"
        class="input-checkbox" />
      <label class="inline-block" for="tos_field">Accept terms of service</label>
      <br>
      <ErrorMessage name="tos"/>
    </div>
    <button type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>

export default {
  data() {
    return {
      schema: {
        name: 'required|min:3|max:20|alpha_spaces',
        email: 'required|min:3|max:50|email',
        age: 'required|between:18,100|numeric',
        password: 'required:min:5|max:100',
        confirm_password: 'confirmed:@password',
        country: 'required|included:USA,Mexico,Germany',
        tos: 'required',
      },
      formData: {
        country: 'USA',
      },
    };
  },
  methods: {
    async register(data) {
      // first register the user
      await this.$store.dispatch('registerUser', data);
    },
  },
  components: {

  },
};

</script>
