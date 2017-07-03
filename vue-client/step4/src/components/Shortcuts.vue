<template>
  <div>
    <div class="header">Shortcuts</div>
    <ul>
      <li v-for="item in shortcuts"><img :src="item.ImageURL" class="img20"/> {{item.Name | truncate(15)}}</li>
    </ul>
  </div>
</template>

<style>
  .img20 {
    width: 20px;
  }
</style>

<script>
import axios from 'axios';
import { truncate } from './filters';

export default {
  name: 'shortcuts',
  components: { truncate },
  created() {
    this.getShortcuts();
  },
  data() {
    return {
      shortcuts: [],
    };
  },
  methods: {
    getShortcuts() {
      axios.get('http://localhost:1234/api/shortcuts').then((response) => {
        this.shortcuts = response.data;
      }).catch(() => {});
    },
  },
};
</script>
