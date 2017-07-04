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
    font-size: 12pt;
    font-weight: bold;
    margin-top: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  .fa {
    font-size: 12pt;
  }
  .avatar {
    float: left;
    margin-right: 10px;
  }
  .img32 {
    width: 32px;
  }
  .img40 {
    width: 40px;
  }
  .img64 {
    width: 64px;
  }
  .columns {
    display: flex;
    text-align: center;
  }
</style>
