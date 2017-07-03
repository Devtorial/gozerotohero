<template>
  <div id="app">
    <router-view :me="me"></router-view>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  created() {
    this.getLoggedInUser();
  },
  data() {
    return {
      me: undefined,
    };
  },
  methods: {
    getLoggedInUser() {
      axios.get('http://localhost:1234/api/users/me').then((response) => {
        this.me = response.data;
      }).catch(() => {});
    },
  },
};
</script>

<style>
    a {
      cursor: pointer;
    }
    h1 {
      font-size: 14pt;
      margin-top: 10px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    .fa {
      font-size: 12pt;
    }
</style>
