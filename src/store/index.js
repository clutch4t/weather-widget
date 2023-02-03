import Vuex from 'vuex'


let cities = window.localStorage.getItem("cities");

export default new Vuex.Store({
  state: {
    cities: cities ? JSON.parse(cities) : [],
  },
  mutations: {
    addToList(state, payload) {
      let found = state.cities.find(item => item.location.name == payload.location.name);

      if (!found) {
        state.cities.push(payload);
      }

      this.commit("saveData");
    },
    saveData(state) {
      window.localStorage.setItem("cities", JSON.stringify(state.cities));
    },
    removeFromList(state, data) {

      state.cities.forEach(element => {
        if (element.location.name == data.location.name) {
          let index = state.cities.indexOf(element);
          state.cities.splice(index, 1);
        }
      });

      this.commit("saveData");
    }
  },

})
