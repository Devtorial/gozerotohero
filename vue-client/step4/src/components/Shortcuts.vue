<template>
  <div>
    <div class="header">Shortcuts</div>
    <ul>
      <li v-for="item in shortcuts"><span class="icon"></span>{{item.Name | truncate(15)}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'shortcuts',
  created() {
    this.getShortcuts();
  },
  data() {
    return {
      shortcuts: [],
    }
  },
  methods: {
    getShortcuts() {
      axios.get('/api/shortcuts').then((response) => {
        this.shortcuts = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
  }
}
</script>
