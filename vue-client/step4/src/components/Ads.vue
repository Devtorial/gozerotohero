<template>
  <div>
    <ul>
      <li v-for="item in ads">
        <a :href="item.LinkURL" v-on:mouseenter="waitPopup($event.target, item, adsPopup)" v-on:mouseleave="waitClearPopup(adsPopup)"><img :src="item.ImageURL"/>
        <div>{{item.Title}}</div>
        <div>{{item.Website}}</div>
        <div>{{item.Text}}</div></a>
      </li>
    </ul>
    <div id="adsPopup" class="popup" v-show="adsPopup.visible" v-on:mouseenter="adsPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(adsPopup)">
      <h1>Ads popup</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { PopupMixin } from './mixins';

export default {
  name: 'ads',
  created() {
    this.getAds();
  },
  data() {
    return {
      ads: [],
      adsPopup: { visible: false, elementId: 'adsPopup', preferredLocation: 'left' },
    };
  },
  methods: {
    getAds() {
      axios.get('http://localhost:1234/api/ads').then((response) => {
        this.ads = response.data;
      }).catch(() => {});
    },
  },
  mixins: [PopupMixin],
};
</script>
