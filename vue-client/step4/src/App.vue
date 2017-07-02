<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
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
