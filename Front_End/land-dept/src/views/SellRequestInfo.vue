<template>
  <v-layout column>
    <v-flex>
      <v-layout row wrap>
        <v-flex xs12 md3 offset-md2>
          <material-card class="v-card-profile">
            <v-card-text class="text-xs-center">
              <h6 class="category text-gray font-weight-thin">Land Id</h6>
              <h3 style="margin-top:2px;">{{land.landId}}</h3>
              <v-divider></v-divider>
              <h4
                class="card-title font-weight-light mt-3"
              >{{currentOwner.firstName}} {{currentOwner.lastName}}</h4>
              <h6 class="category text-gray font-weight-thin mb-3">{{currentOwner.username}}</h6>
              <h6 class="category text-gray font-weight-thin mb-3">{{currentOwner.email}}</h6>
              <v-btn color="success" round class="font-weight-light">Current Owner</v-btn>
            </v-card-text>
          </material-card>
        </v-flex>
        <v-flex md2>
          <div style="height:100%;padding-top: 120px;">
            <span style="margin-left:40px !important;" class="arrow">&#8594;</span>
          </div>
        </v-flex>
        <v-flex xs12 md3>
          <material-card class="v-card-profile">
            <v-card-text class="text-xs-center">
              <h6 class="category text-gray font-weight-thin">Land Id</h6>
              <h3 style="margin-top:2px;">{{land.landId}}</h3>
              <v-divider></v-divider>
              <h4
                class="card-title font-weight-light mt-3"
              >{{newOwner.firstName}} {{newOwner.lastName}}</h4>
              <h6 class="category text-gray font-weight-thin mb-3">{{newOwner.username}}</h6>
              <h6 class="category text-gray font-weight-thin mb-3">{{newOwner.email}}</h6>
              <v-btn color="success" round class="font-weight-light">New Owner</v-btn>
            </v-card-text>
          </material-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex style="margin-top:75px;">
      <v-flex>
        <div class="mapouter">
          <l-map :zoom="18" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"/>
            <div v-if="data.partSell">
              <l-polygon :latLngs="sellCoordinates" color="red" fillColor="red" :weight="2"></l-polygon>
              <l-polygon :latLngs="keepCoordinates" color="green" fillColor="green" :weight="2"></l-polygon>
            </div>
            <l-polygon v-else :latLngs="coordinates"></l-polygon>
          </l-map>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "../axios";
import { LMap, LTileLayer, LMarker, LPolygon, LPolyline } from "vue2-leaflet";

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
      land: {},
      currentOwner: {},
      newOwner: {},
      sellCoordinates: [],
      keepCoordinates: [],
      coordinates: [],
      data: {},
      center: { lat: 12, lng: 70 },
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  methods: {
    getLatLonCenterFromGeom(coords) {
      const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

      const centerLat = arrAvg(coords.map(c => c.lat));
      const centerLon = arrAvg(coords.map(c => c.lng));

      if (isNaN(centerLat) || isNaN(centerLon)) return null;
      else return { lat: centerLat, lng: centerLon };
    }
  },
  async created() {
    var data = this.$route.query;
    console.log("data: ", data);
    this.data = data;
    try {
      var land = await axios.get(
        "/api/org.pingala.landregistry.Land/" + data.landId
      );
      land = land.data;
      this.land = land;

      var currentOwner = await axios.get(
        "/api/org.pingala.landregistry.User/" + land.owner.split("#")[1]
      );
      this.currentOwner = currentOwner.data;

      var newOwner = await axios.get(
        "/api/org.pingala.landregistry.User/" + data.newOwner
      );
      this.newOwner = newOwner.data;
    } catch (error) {
      console.log("error: ", error);
    }

    if (data.partSell) {
      this.sellCoordinates = JSON.parse(data.sellCoordinates).map(
        coordinate => {
          return {
            lat: parseFloat(coordinate.lat),
            lng: parseFloat(coordinate.lng)
          };
        }
      );
      this.keepCoordinates = JSON.parse(data.keepCoodinates).map(coordinate => {
        return {
          lat: parseFloat(coordinate.lat),
          lng: parseFloat(coordinate.lng)
        };
      });
      this.center = this.getLatLonCenterFromGeom(this.keepCoordinates);
    } else {
      this.coordinates = JSON.parse(this.land.coordinates).map(coordinate => {
        return {
          lat: parseFloat(coordinate.lat),
          lng: parseFloat(coordinate.lng)
        };
      });
      this.center = this.getLatLonCenterFromGeom(this.coordinates);
    }
  }
};
</script>

<style scoped>
.mapouter {
  height: 400px;
  border: 3px solid lightslategray;
  margin-bottom: 20px !important;
}
.cardTitle {
  padding: 10px;
}
.ownerTitles {
  color: brown;
  font-weight: bold;
  margin-right: 5px;
}
#map {
  overflow: scroll;
  width: 100%;
  height: 100%;
}
.historyList {
  overflow-x: scroll;
}
.historyList::-webkit-scrollbar {
  display: none;
}
.arrow {
  font-size: 40px;
  font-weight: bold;
  color: lightslategray;
  margin-left: 10px;
}
</style>
