<template>
  <div>
    <navbar></navbar>
    <div class="page">
      <div id="leftnav">
        <ul v-if="me">
          <li><span class="icon"><img class="miniprofile" :src="me.Picture.Thumbnail"/></span> 
              {{me.Name.First + ' ' + me.Name.Last}}</li>
        </ul>
        <ul>
          <li><span class="icon"><i class="fa fa-newspaper-o"></i></span> News Feed</li>
          <li><span class="icon"><i class="fa fa-comments-o"></i></span> Messenger</li>
        </ul>
        <shortcuts></shortcuts>
        <explores></explores>>
        <div class="header">Create</div>
        <div class="footer"><a>Ad</a> · <a>Page</a> · <a>Group</a> · <a>Event</a> · <a>Fundraiser</a></a></div>
      </div>
      <div id="maincontent">
        <feed></feed>
      </div>
      <div id="rightnav">
        <pages id="pages" class="list-group-item"></pages>
        <events class="list-group-item"></events>
        <trending class="list-group-item"></trending>
        <ads class="list-group-item"></ads>
        <languages class="list-group-item"></languages>
        <div>Privacy · Terms · Advertising · Ad Choices · Cookies · More · 
        Clonebook © 2017</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import navbar from './Navbar';

export default {
  name: 'home',
  created() {
    this.getLoggedInUser();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  components: {
    navbar,
  },
  data() {
    return {
      me: undefined,
      selected: {},
      pagePopup: { visible: false, elementId: 'pagePopup', preferredLocation: 'left' },
    };
  },
  methods: {
    handleScroll() {
      this.scrollPane(document.getElementById('leftnav'));
      this.scrollPane(document.getElementById('rightnav'));
      this.infiniteScroll();
    },
    scrollPane(pane) {
      const headerHeight = 60;
      const rect = pane.getBoundingClientRect();

      if (rect.bottom > window.innerHeight || -window.pageYOffset + headerHeight > rect.top) {
        pane.style.top = `${-window.pageYOffset + headerHeight} px`; // eslint-disable-line no-param-reassign
      }
    },
    getDocHeight() { // calculates document height same way as jquery does
      const body = document.body;
      const html = document.documentElement;
      return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight);
    },
    infiniteScroll() { // fetch data when < 200 px from bottom
      if (window.pageYOffset + window.innerHeight >= this.getDocHeight() - 200) {
        this.getFeed();
      }
    },
    getLoggedInUser() {
      axios.get('/api/users/me').then((response) => {
        this.me = response.data;
      }).catch((response) => {
        console.log('error', response);
      });
    },
  },
  // mixins: [popupMixin, imagePrefixMixin],
};
</script>

<style>
</style>
