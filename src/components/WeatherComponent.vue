<template>
  <div class="weather">
    <header>
      <div class="header__settings" @click="showFilter">
        <i class="fa-solid fa-gear"></i>
      </div>
    </header>
    <main>
      <section>
        <div class="places" v-for="(city, index) in weatherResponse" :key="index">
          <div class="place">
            <div class="weather__display">
              <div class="weather__city">{{ city.location.name }}, {{
                city.location.country
              }}</div>
              <div class="weather__condition">
                <img src="../assets/svg/sunny.svg" alt="">
              </div>
              <div class="weather__temp">{{ city.current.temp_c }}° C</div>
            </div>
            <div class="weather__details">
              <div class="weather__parameter">Feels like</div>
              <div class="weather__value">{{ city.current.feelslike_c }}° C </div>
              <div class="weather__parameter">Condition</div>
              <div class="weather__value">{{ city.current.condition.text }}</div>
              <div class="weather__parameter">Wind</div>
              <div class="weather__value">{{ city.current.wind_kph }} kph</div>
            </div>
            <div class="weather__misc">
              <div class="weather__misc-detail">
                <img src="../assets/svg/wind_dir.svg" alt="">
                {{ city.current.wind_degree }} {{ city.current.wind_dir }}
              </div>
              <div class="weather__misc-detail">
                <img src="../assets/svg/compass.svg" alt="">
                {{ city.current.pressure_mb }} hPa
              </div>
              <div class="weather__misc-detail">
                <img src="../assets/svg/percent.svg" alt="">
                {{ city.current.humidity }}%
              </div>
              <div class="weather__misc-detail">
                <img src="../assets/svg/visibility.svg" alt="">
                {{ city.current.vis_km }} km
              </div>
              <div class="weather__misc-detail">
                <img src="../assets/svg/precipitation.svg" alt="">
                {{ city.current.precip_mm }} mm
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <div class="filter">
      <draggable :list="weatherResponse" @start="drag = true" @end="drag = false" handle=".handle"
        item-key="location.name">
        <template #item="{ element }">
          <div class="chosenPlaces">
            <div class="chosenPlace" draggable="true">
              <div class="dragIcon handle">
                <img src="../assets/svg/dragIcon.svg" alt="drag">
              </div>
              <div class="selectedPlace">{{ element.location.name }}, {{
                element.location.country
              }}</div>
              <div class="removeBtn" @click="removeCity(city)">
                <img src="../assets/svg/trash.svg" alt="remove">
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <h3>Add location:</h3>
      <div class="selectCity">
        <input type="text" v-model="searchInput" id="searchInput" placeholder="Enter the city..."
          @keyup.enter="getData">
        <div class="applyFilter" @click="getData">
          <img src="../assets/svg/check.svg" alt="Apply">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import '../style/style.scss'
import toastr from 'toastr'
const API_KEY = "8e23bb8076b04f16854104233230102";

export default {
  name: 'WeatherComponent',
  props: {
  },

  data() {
    return {
      drag: false,
      searchInput: "",
      duplicatedCity: false,
      weatherResponse: [],
    }
  },
  components: {
    draggable
  },


  methods: {
    showFilter() {
      if (document.querySelector(".filter").classList.contains("active")) {
        document.querySelector(".header__settings").innerHTML = `<i class="fa-solid fa-gear"></i>`;
        document.querySelector("body").style = "overflow: visible";
      } else {
        document.querySelector(".header__settings").innerHTML = `<i class="fa-solid fa-x"></i>`;
        document.querySelector("body").style = "overflow: hidden";
      }
      document.querySelector(".filter").classList.toggle("active");
    },


    getData() {
      this.weatherResponse.forEach((element) => {
        if (this.searchInput == element.location.name) {
          this.duplicatedCity = true;
        }
      })

      if (this.searchInput != "" && !this.duplicatedCity) {
        axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${this.searchInput}&aqi=no`)
          .then((response) => {
            if (response.data?.error?.code != 1006) {
              this.weatherResponse.push(response.data);
              this.searchInput = "";
              this.$store.commit("addToList", response.data);
            } else {
              toastr.error("No matching location found");
            }
          })
      } else {
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": true,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "3000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut",
        }
        toastr.error("This city is already on the list!")
      }

      this.duplicatedCity = false;
    },

    removeCity(item) {
      console.log(item);
      this.weatherResponse.forEach((element) => {
        if (item.location.name == element.location.name) {
          let index = this.weatherResponse.indexOf(item);
          this.weatherResponse.splice(index, 1);
        }
      })

      this.$store.commit("removeFromList", item);
    },

    // COOKIES 

    checkCookies() {
      this.weatherResponse = JSON.parse(window.localStorage.getItem("cities"));
    },

    // LOCATION REQUEST

    getLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords.latitude && position.coords.longitude) {
          axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${Math.round(position.coords.latitude)},${Math.round(position.coords.longitude)}&aqi=no`)
            .then((response) => {
              var found = this.weatherResponse.find((item) => item.location.name == response.data.location.name);

              if (response.data?.error?.code != 1006 && !found) {
                this.weatherResponse.push(response.data);
                this.$store.commit("addToList", response.data);
              }
            })
        }
      },
        (error) => {
          console.log(error.message);
        }
      )
    }

  },

  mounted() {
    this.checkCookies();
    this.getLocation();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
