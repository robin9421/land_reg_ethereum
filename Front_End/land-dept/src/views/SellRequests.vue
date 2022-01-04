<template>
  <v-container fill-height fluid grid-list-xl>
    <v-flex md12 lg12>
      <material-card color="orange" title="Sell Requests" text="List of Owner change requests">
        <v-data-table :headers="headers" :items="items" hide-actions>
          <template slot="headerCell" slot-scope="{ header }">
            <span class="font-weight-light text-warning text--darken-3" v-text="header.text"/>
          </template>
          <template slot="items" slot-scope="{ index, item }">
            <td>{{ item.requestId }}</td>
            <td>{{ item.newOwner }}</td>
            <td>{{ item.landId }}</td>
            <td class="text-md-center">
              <span class="true">&#10004;</span>
            </td>
            <td class="text-md-center">
              <span class="true" v-if="item.approvedByMuncipality">&#10004;</span>
              <span class="false" v-else>&#10008;</span>
            </td>
            <td class="text-md-center">
              <span class="false">&#10008;</span>
            </td>
            <td>
              <v-btn
                color="success"
                small
                :to="{ path:'/sell-request-info/' + item.requestId, query: item }"
              >View</v-btn>
              <!-- <v-btn color="orange" small @click="approveSell(item.requestId)">Approve</v-btn> -->
            </td>
          </template>
        </v-data-table>
      </material-card>
      <v-dialog v-model="sellDialog" width="600px">
        <v-card>
          <v-container>
            <v-layout>
              <v-flex md8 mt-3>
                <v-select
                  v-model="selectedOwner"
                  :items="usernameList"
                  label="Select New Owner"
                  outline
                ></v-select>
              </v-flex>
              <v-flex mt-3 offset-md1>
                <v-btn color="blue" @click="sellLand">Change</v-btn>
              </v-flex>
            </v-layout>
            <p class="red--text">{{error}}</p>
          </v-container>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>

<script>

import GoogleMaps from "load-google-maps-api";
import axios from "../axios";
export default {
  data() {
    return {
      sellDialog: false,
      selectedOwner: "",
      error: "",
      usernameList: [],
      landToBeSold: "",
      headers: [
        {
          sortable: false,
          text: "Request Id",
          value: "requestId"
        },
        {
          sortable: false,
          text: "New Owner",
          value: "owner"
        },
        {
          sortable: false,
          text: "Land Id",
          value: "landId"
        },
        {
          sortable: false,
          text: "Land Department",
          value: "landDept"
        },
        {
          sortable: false,
          text: "Muncipality",
          value: "muncipality"
        },
        {
          sortable: false,
          text: "Higher Authority",
          value: "higherAuth"
        },
        {
          text: "Options",
          value: "Options"
        }
      ],
      items: []
    };
  },
  methods: {
    sellLandPopup(landId) {
      this.landToBeSold = landId;
      this.sellDialog = true;
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
    navigate(index) {
      this.$router.push({ path: "/info", params: { id: index } });
    }
  },
  async created() {
    try {
      var lands = await axios.get(
        "/api/org.pingala.landregistry.LandDeptSellRequest"
      );
      this.items = lands.data;
    } catch (error) {
      this.error = error;
    }
  }
};
</script> 
<style>
.true {
  color: green;
  font-size: 30px;
}
.false {
  color: red;
  font-size: 25px;
}
</style>