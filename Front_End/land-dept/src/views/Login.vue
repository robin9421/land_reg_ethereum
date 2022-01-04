<template>
  <div>
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex xs12 md8>
          <material-card color="green" title="Login" text="">
            <v-form>
              <v-container py-0>
                <v-layout column>
                  <v-flex md4 sm4>
                    <v-text-field v-model="username" class="purple-input" label="User Name"/>
                  </v-flex>
                  <v-flex md4 sm4>
                    <v-text-field v-model="password" type="password" class="purple-input" label="password"/>
                  </v-flex>
                  <v-flex xs12 text-xs-right>
                    <v-btn @click="register" class="mx-0 font-weight-light" color="success">Login</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      error: ""
    };
  },
  methods: {
    async register() {
      localStorage.setItem("username", this.username);
      this.$router.push("/dashboard");
    }
  }
};
</script>
