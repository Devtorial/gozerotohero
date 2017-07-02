<template>
  <div>
    <div class="header">Shortcuts</div>
    <ul>
      <li v-for="item in shortcuts"><span class="icon"></span>{{item.Name | truncate(15)}}</li>
    </ul>
  </div>
</template>

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
      }).catch((response) => {
        console.log('error', response);
      });
    },
  },
};
</script>
