<template>
  <div>
    <div class="header">Explore</div>
    <ul>
      <li v-for="item in exploresFiltered || explores"><span class="icon"><i :class="'fa '+item.Icon"></i></span> {{item.Name | truncate(15)}}</li>
      <a v-on:click="exploresFiltered = undefined"><li v-if="exploresFiltered"><i class="fa fa-caret-down"></i> See More...</li></a>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'explores',
  created() {
    this.getExplores();
  },
  data() {
    return {
      explores: [],
      exploresFiltered: [],
    };
  },
  methods: {
    getExplores() {
      axios.get('http://localhost:1234/api/explores').then((response) => {
        this.explores = response.data;
        this.exploresFiltered = this.explores.slice(0, 10);
      }).catch(() => {});
    },
  },
};
</script>
