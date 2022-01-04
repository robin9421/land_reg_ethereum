<template>
  <v-card :loading="loading" class="mx-auto my-12" max-width="1200">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-layout wrap>
          <v-flex md6 mt-2>
            <v-text-field v-model="name" label="Name" required></v-text-field>
          </v-flex>
          <v-flex md6 mt-2>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
          </v-flex>
          <v-flex md6 mt-2>
            <v-text-field v-model="phone" label="Phone" required></v-text-field>
          </v-flex>
          <v-flex md6 mt-2>
            <v-text-field
              v-model="landId"
              disabled
              label="Auto Generated LandId"
              outline
            ></v-text-field>
          </v-flex>
          <v-flex md12>
            <v-checkbox
              v-model="checkbox"
              :rules="[(v) => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Validate
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
  }),
  created: function () {
    var landId = Math.random().toString(36).substring(2).toUpperCase();
    this.landId = landId;
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>