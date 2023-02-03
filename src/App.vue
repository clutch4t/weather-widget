<template>
  <div id="#app">
    <WeatherComponent></WeatherComponent>
  </div>
</template>

<script>
import WeatherComponent from '@/components/WeatherComponent.vue';


export default {
  name: "App",
  props: [],
  components: {
    WeatherComponent
  },
  methods: {

  }
}

</script>

<style lang="scss">

</style>
