<template>
  <v-container fill-height fluid grid-list-xl>
    <v-flex md12 lg12>
      <div class="text-xs-right">
        <add-land-view @landAdded="landAdded"></add-land-view>
      </div>
      <material-card color="orange" title="Land Records" text="List of all land records">
        <v-data-table :headers="headers" :items="items" hide-actions>
          <template slot="headerCell" slot-scope="{ header }">
            <span class="font-weight-light text-warning text--darken-3" v-text="header.text"/>
          </template>
          <template slot="items" slot-scope="{ item }">
            <td><strong>{{ item.landId }}</strong></td>
            <td>{{ item.owner.split("#")[1] }}</td>
            <td>{{ item.coordinates }}</td>
            <!-- <td>
              <v-layout column v-if="item.underChange">
                <v-flex><strong>New Owner: {{item.underChange.newOwner}}</strong></v-flex>
                <v-flex><strong>MuncipalitityApproval: {{item.underChange.MuncipalitityApproval}}</strong></v-flex>
                <v-flex><strong>HigherAuthorityApproval: {{item.underChange.HigherAuthorityApproval}}</strong></v-flex>
              </v-layout>
            </td> -->
            <td>
              <v-btn color="success" small :to="{ path:'/info/' + item.landId, query: item }">View</v-btn>
              <v-btn color="orange" small @click="sellLandPopup(item.landId)">Change Owner Request</v-btn>
              <v-btn color="orange" small :to="{ path:'/partSell/' + item.landId, query: item }">Part Change Request</v-btn>
            </td>
          </template>
        </v-data-table>
      </material-card>
      <v-dialog v-model="sellDialog" width="600px">
        <v-card>
          <v-container>
            <v-layout column>
              <v-flex md5 mt-3>
                <v-select v-model="selectedOwner" :items="usernameList" label="Select New Owner"></v-select>
              </v-flex>
              <v-flex mt-3>
                <v-btn color="success" @click="createSellRequest">Create</v-btn>
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
import AddLandView from "../components/custom/AddLand";

import GoogleMaps from "load-google-maps-api";
import axios from "../axios";
export default {
  components: {
    addLandView: AddLandView
  },
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
          text: "LandId",
          value: "landid"
        },
        {
          sortable: false,
          text: "Owner Name",
          value: "owner"
        },
        {
          sortable: false,
          text: "Co-ordinates",
          value: "coordinates"
        },
        // {
        //   sortable: false,
        //   text: "Under Change Request",
        //   value: "change"
        // },
        {
          text: "Options",
          value: "Options"
        }
      ],
      items: []
    };
  },
  methods: {
    landAdded(land) {
      this.items.unshift({ ...land, owner: land["$class"] + "#" + land.owner });
    },
    sellLandPopup(landId) {
      this.landToBeSold = landId;
      this.sellDialog = true;
    },
    async createSellRequest() {
      var requestId = Math.random()
        .toString(36)
        .substring(9);
      try {
        await axios.post("/api/org.pingala.landregistry.LandDeptSellRequest", {
          $class: "org.pingala.landregistry.LandDeptSellRequest",
          landId: this.landToBeSold,
          newOwner: this.selectedOwner,
          requestId: requestId,
          approvedByMuncipality: false
        });
        this.sellDialog = false;
      } catch (error) {
        this.error = error;
      }
    }
  },
  async created() {
    try {
      var lands = await axios.get("/api/org.pingala.landregistry.Land");
      this.items = lands.data;

      // var underChangeRequest = await axios.get(
      //   "/api/org.pingala.landregistry.LandDeptSellRequest"
      // );
      // underChangeRequest.data.forEach(changeLand => {
      //   this.items.forEach(land => {
      //     if (land.landId == changeLand.landId) {
      //       land.underChange = {
      //         newOwner: changeLand.newOwner,
      //         MuncipalitityApproval: changeLand.approvedByMuncipality,
      //         HigherAuthorityApproval: false
      //       };
      //     }
      //   });
      // });

      var users = await axios.get("/api/org.pingala.landregistry.User");
      users.data.forEach(user => {
        this.usernameList.push(user.username);
      });
    } catch (error) {
      this.error = error;
    }
  }
};
</script> 
<style>
</style>