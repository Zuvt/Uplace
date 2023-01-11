<template>
  <div class="grid grid-cols-1 md:grid-cols-3 w-1/1 gap-2 h-max">
    <div class="h-1/1 w-1/1 p-2 max-w-xs">
      <form action="/" @submit.prevent="searchButtonPressed">
        <div class="">
          <div class="relative m-auto">
            <label class="input-label" for="address"> Adresse: </label>
            <input
              class="txt-input"
              type="text"
              name="address"
              id="address"
              placeholder="Entrez Votre Addresse"
              v-model="getCoordinates"
            />
            <LocationMarkerIcon
              :class="
                'h-5 w-5 text-sky-500 absolute right-2 top-8 cursor-pointer' +
                (lat == 0 ? ' animate-bounce' : '')
              "
              @click="getUserLocation"
            />
            <br /><button
              class="cursor-pointer p-1 text-cyan-500 text-sm hover:font-semibold"
              @click="useLastCoords"
            >
              Utiliser ma dernière position
            </button>
          </div>
          <label class="input-label" for="address"> Type de service </label>
          <div class="flex">
            <select
              name="Select service"
              id=""
              class="txt-input mr-2"
              v-model="type"
            >
              <option value="2" disabled selected hidden>Select service</option>
              <option
                v-for="(item, index) in placesTypes"
                :key="index"
                :value="item"
              >
                {{ placesTypesFR[index] }}
              </option>
            </select>
            <select
              class="select-input inline-block w-1/3"
              name="radius"
              id="radius"
              v-model="radius"
            >
              <option selected value="0.5">500m</option>
              <option value="1">1km</option>
              <option value="3">3km</option>
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="20">20km</option>
            </select>
          </div>
          <button class="btn flex justify-center items-center">
            Chercher <SearchIcon class="h-4 w-4 mx-2" />
          </button>
        </div>
      </form>
    </div>
    <div id="map" class="md:col-span-2 row-span-2 md:h-full h-72 w-1/1"></div>
    <div class="places-list flex flex-col">
      <!-- PLACES LIST -->
      <h2 v-show="!places[0]" class="uppercaser text-gray-400 m-auto">
        Aucune resultat
      </h2>
      <div
        v-for="place in places"
        :key="place.distance"
        class="places-list-item"
      >
        <h3 class="text-gray-600 font-bold">
          {{ place.title }}
        </h3>
        <!-- <h5 class="text-sm text-gray-600 px-2 py-1 rounded-md flex">
          <FlagIcon class="h-5 w-5 text mr-2" /><span
            v-html="place.vicinity"
          ></span>
        </h5> -->

        <!-- DISTANCE -->
        <span class="text-sm text-gray-500 font-semibold">
          🚩
          {{
            place.distance >= 1000
              ? Math.trunc(place.distance / 1000) + " km"
              : place.distance + " m"
          }}
        </span>

        <template v-if="place.openingHours">
          <!-- OPENING HOURS -->
          <p class="text-slate-600 text-sm items-center flex mt-1">
            <span class="font-semibold"
              ><ClockIcon class="h-5 w-5 text-sky-500 mr-2"
            /></span>

            <span v-html="place.openingHours.text"></span>
          </p>
          <!-- ISOPEN LABEL -->
          <span
            class="text-xs font-bold p-1 rounded absolute right-2 top-1"
            :class="
              place.openingHours.isOpen ? 'text-green-400' : 'text-red-400'
            "
          >
            {{ place.openingHours.isOpen ? "Ouvert" : "Fermé" }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";
import {
  LocationMarkerIcon,
  SearchIcon,
  ClockIcon,
  FlagIcon,
} from "@heroicons/vue/solid";
import leaflet from "leaflet";
axios.defaults.headers.get["Accept-Language"] = "fr-FR";
export default {
  name: "Home",
  components: {
    LocationMarkerIcon,
    SearchIcon,
    ClockIcon,
    FlagIcon,
  },
  data() {
    return {
      placesTypesFR: [
        "restaurant",
        "manger, boire",
        "café & thé",
        "snacks & fast food",
        "sortir",
        "sites/musées",
        "transport",
        "aéroport",
        "logement",
        "achats",
        "loisirs plein air",
        "bâtiments administratifs",
        "géographique naturel",
        "station d'essence",
        "guichet banque change",
        "toilettes aire de repos",
        "hôpital/établissement de soins de santé",
      ],
      placesTypes: [
        "restaurant",
        "eat-drink",
        "coffee-tea",
        "snacks-fast-food",
        "going-out",
        "sights-museums",
        "transport",
        "airport",
        "accommodation",
        "shopping",
        "leisure-outdoor",
        "administrative-areas-buildings",
        "natural-geographical",
        "petrol-station",
        "atm-bank-exchange",
        "toilet-rest-area",
        "hospital-health-care-facility",
      ],
    };
  },

  computed: {
    getCoordinates() {
      return `${this.lat}, ${this.long}`;
    },
  },
  watch: {},
  setup() {
    const type = ref("");
    const radius = ref(0.5);
    var lat = ref(0);
    var long = ref(0);
    const places = ref([]);
    const added = ref([]);
    var markerGroup, mymap, circleGroup, myPosition;
    onMounted(() => {
      mymap = leaflet.map("map").setView([31.791702, -7.09262], 6);
      leaflet
        .tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWVkMjBhIiwiYSI6ImNsMnhta25mazB4YngzbXFta3JiYmY1cW8ifQ.tCEE7Isho37itY6t2FGfoA",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "your.mapbox.access.token",
          }
        )
        .addTo(mymap);
      markerGroup = leaflet.layerGroup().addTo(mymap);
      circleGroup = leaflet.layerGroup().addTo(mymap);
      myPosition = leaflet.layerGroup().addTo(mymap);
    });

    const useLastCoords = () => {
      const coords = JSON.parse(localStorage.getItem("coords")) || null;
      lat.value = coords.lat.slice(1);
      long.value = coords.long.slice(1);
    };

    const clearMarkerGroup = () => {
      markerGroup.clearLayers();
      added.value[0] = [];
    };

    const searchButtonPressed = () => {
      if (type.value && radius.value && lat.value !== 0 && long.value !== 0) {
        // verification
        URL = `https://places.ls.hereapi.com/places/v1/discover/explore?in=${
          lat.value
        },${long.value};r=${radius.value * 1000}&cat=${type.value}&size=${
          radius.value * 60
        }&apiKey=Qv7QMHRDzU5q9S_f_zvaT9iEHYa74zAI96yweSD536A&pretty`;
        axios
          .get(URL)
          .then((response) => {
            places.value = response.data.results.items;
            addLocationsToMap();
          })
          .catch((error) => console.log("⭐" + error));

        circleGroup.clearLayers();
        var circle = leaflet
          .circle([lat.value, long.value], {
            color: "#ffea05",
            fillColor: "#64f70e",
            fillOpacity: 0.2,
            radius: radius.value * 1000,
          })
          .addTo(circleGroup);

        mymap.setView([lat.value, long.value], 13);
      } else if (!type.value) {
        console.log("😍😎 please choose a category");
      }
      if (added.value[0] !== `marked ${lat.value} ${long.value}`) {
        var myIcon = leaflet.icon({
          iconUrl: "src/assets/user.png",
          iconSize: [45, 45],
          iconAnchor: [22, 45],
          popupAnchor: [-3, -76],
          shadowUrl: "src/assets/marker-shadow.png",
          shadowSize: [45, 45],
          shadowAnchor: [14, 45],
        });

        leaflet
          .marker([lat.value, long.value], { icon: myIcon })
          .addTo(myPosition);
        added.value[0] = `marked ${lat.value} ${long.value}`;
      }
    };

    function getUserLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        lat.value = position.coords.latitude;
        long.value = position.coords.longitude;
        mymap.setView([lat.value, long.value], 14);
      });
      if (added.value[0] !== `marked ${lat.value} ${long.value}`) {
        var myIcon = leaflet.icon({
          iconUrl: "src/assets/user.png",
          iconSize: [45, 45],
          iconAnchor: [22, 45],
          popupAnchor: [-3, -76],
          shadowUrl: "src/assets/marker-shadow.png",
          shadowSize: [45, 45],
          shadowAnchor: [14, 45],
        });

        leaflet
          .marker([lat.value, long.value], { icon: myIcon })
          .addTo(myPosition);
        added.value[0] = `marked ${lat.value} ${long.value}`;
      }
    }
    const addLocationsToMap = () => {
      markerGroup.clearLayers();
      places.value.forEach((place) => {
        var marker = leaflet
          .marker([place.position[0], place.position[1]])
          .bindPopup(`<b>${place.title}</b><br>${place.vicinity}.`)
          .openPopup()
          .addTo(markerGroup);
      });
      if (added.value[0] !== `marked ${lat.value} ${long.value}`) {
        var myIcon = leaflet.icon({
          iconUrl: "src/assets/user.png",
          iconSize: [45, 45],
          iconAnchor: [22, 45],
          popupAnchor: [-3, -76],
          shadowUrl: "src/assets/marker-shadow.png",
          shadowSize: [45, 45],
          shadowAnchor: [14, 45],
        });

        leaflet
          .marker([lat.value, long.value], { icon: myIcon })
          .addTo(myPosition);
        added.value[0] = `marked ${lat.value} ${long.value}`;
      }
    };

    return {
      useLastCoords,
      getUserLocation,
      searchButtonPressed,
      radius,
      type,
      places,
      lat,
      long,
    };
  },
};
</script>

<style scoped>
.input-label {
  @apply text-xs uppercase text-gray-600 font-medium;
}
.btn {
  @apply w-full max-w-xs py-2 bg-gradient-to-br from-cyan-500 to-sky-600 rounded uppercase font-medium text-sm text-gray-100 hover:scale-105 transition-all ease-in-out delay-100;
}
.txt-input {
  @apply w-full border rounded py-2 px-2 focus:outline-[1px] focus:outline-sky-500 text-gray-600 text-sm mb-2 capitalize shadow-sm;
}
.select-input {
  @apply border rounded py-2 px-2 focus:outline-[1px] focus:outline-sky-500 text-gray-600 text-sm mb-2 capitalize;
}

.places-list {
  @apply md:h-[450px] w-full bg-gray-100 px-2 overflow-y-scroll scrollbar-w-3 scrollbar-thumb-slate-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-md rounded-md h-screen;
}
.places-list-item {
  @apply px-2 py-1 bg-white rounded mt-2 relative border shadow-sm;
}
</style>
