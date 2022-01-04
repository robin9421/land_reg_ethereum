<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        md12
      >
        <material-card
          color="green"
          title="Users List"
          text="Users List"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="subheading font-weight-light text-success text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
            >
              <td>{{ item.username }}</td>
              <td>{{ item.firstName }}</td>
              <td>{{ item.lastName }}</td>
              <td>{{ item.email }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '../axios';
export default {
  data: () => ({
    headers: [
      {
        sortable: false,
        text: 'Username',
        value: 'username'
      },
      {
        sortable: false,
        text: 'First Name',
        value: 'firstName'
      },
      {
        sortable: false,
        text: 'Last Name',
        value: 'lastName'
      },
      {
        sortable: false,
        text: 'Email',
        value: 'email',
      }
    ],
    items: [
      {
        username: 'Dakota Rice',
        firstName: 'Niger',
        lastName: 'Oud-Tunrhout',
        email: '$35,738'
      }
    ]
  }),
  async created() {
    var res = await axios.get("/api/org.pingala.landregistry.User");
    this.items = res.data;
  },
}
</script>
