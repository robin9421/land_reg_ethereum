<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <div class="mapouter">
          <l-map :zoom="18" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"/>
            <l-polygon :latLngs="coordinates" color="black" :weight="1" @click="addMarker"></l-polygon>
            <l-marker
              @click="addMarker"
              v-for="(coordinate,index) in sellCoordinates"
              :latLng="coordinate"
              :key="index"
            ></l-marker>
            <l-marker
              v-for="(coordinate,index) in coordinates"
              :latLng="coordinate"
              :key="index"
              @click="addMarker"
            ></l-marker>
            <l-polygon :latLngs="sellCoordinates" color="red" fillColor="red" :weight="2"></l-polygon>
            <l-polygon :latLngs="keepCoordinates" color="green" fillColor="green" :weight="2"></l-polygon>
          </l-map>
        </div>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex mt-5 style="width:400px;">
            <v-select
              outline
              v-model="selectedOwner"
              :items="usernameList"
              label="Select New Owner"
            ></v-select>
          </v-flex>
          <v-flex>
            <v-btn color="success" @click="createSellRequest">Create</v-btn>
          </v-flex>
        </v-layout>
        <p class="red--text">{{error}}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPolygon, LPolyline } from "vue2-leaflet";
import axios from "../axios";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LPolyline
  },
  data() {
    return {
      usernameList: [],
      selectedOwner: "",
      land: {},
      coordinates: [],
      sellCoordinates: [],
      keepCoordinates: [],
      center: { lat: 12, lng: 70 },
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  methods: {
    async createSellRequest() {
      var requestId = Math.random()
        .toString(36)
        .substring(5)
        .toUpperCase();
      var landId = Math.random()
        .toString(36)
        .substring(2)
        .toUpperCase();

      try {
        await axios.post("/api/org.pingala.landregistry.LandDeptSellRequest", {
          $class: "org.pingala.landregistry.LandDeptSellRequest",
          landId: this.land.landId,
          newOwner: this.selectedOwner,
          requestId: requestId,
          approvedByMuncipality: false,
          partSell: true,
          oldCoordinates: this.land.coordinates,
          sellCoordinates: JSON.stringify(this.sellCoordinates),
          keepCoodinates: JSON.stringify(this.keepCoordinates),
          newLandId: landId
        });
        this.$router.push("/dashboard");
      } catch (error) {
        this.error = error;
      }
    },
    addMarker(data) {
      if (this.sellCoordinates.length < 4) {
        this.sellCoordinates.push(data.latlng);
      } else {
        this.keepCoordinates.push(data.latlng);
      }
    },
    getLatLonCenterFromGeom(coordinates) {
      const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

      const centerLat = arrAvg(coordinates.map(c => c.lat));
      const centerLon = arrAvg(coordinates.map(c => c.lng));

      if (isNaN(centerLat) || isNaN(centerLon)) return null;
      else return { lat: centerLat, lng: centerLon };
    }
  },
  async created() {
    this.land = this.$route.query;
    this.coordinates = JSON.parse(this.land.coordinates);
    this.center = this.getLatLonCenterFromGeom(this.coordinates);

    var users = await axios.get("/api/org.pingala.landregistry.User");
    users.data.forEach(user => {
      this.usernameList.push(user.username);
    });
  }
};
</script>

<style scoped>
.mapouter {
  height: 500px;
  border: 3px solid lightslategray;
  margin-bottom: 20px !important;
}
</style>
