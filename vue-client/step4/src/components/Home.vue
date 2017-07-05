<template>
  <div>
    <navbar :me="me"></navbar>
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
        <explores></explores>
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

<style>
  .page {
    margin: 60px auto 0 auto;
    width: 988px;
  }
  #leftnav {
    width: 180px;
    position: fixed;
    padding-top: 10px;
  }
  #leftnav li {
    color: #666;
    cursor: pointer;
    padding: 4px 6px;
  }
  #leftnav li:hover {
    background-color: #ddd;
  }
  #leftnav .icon {
    width: 22px;
    display: inline-block;
  }
  #leftnav .header {
    text-transform: uppercase;
  }
  #maincontent {
    width: 500px;
    float: left;
    margin-left: 190px;
  }
  #rightnav {
    width: 308px;
    position: fixed;
    margin-left: 700px;
  }
  .list-group-item {
    margin-top: 10px;
    padding: 0;
    position: relative; 
    display: block;
    margin-bottom: -1px;
    border: 1px solid #ddd;
  }
  .miniprofile {
    width: 24px;
  }
  .date > a {
    color: #999;
  }
  .date {
    font-size: 12px;
  }
  .popup {
    z-index: 10000;
    border: 1px solid #ddd;
    position: absolute;
    background-color: #fff;
  }
  .description {
    color: #222;
  }
  .grey {
    color: #888;
  }
</style>

<script>
import ads from './Ads';
import events from './Events';
import feed from './Feed';
import languages from './Languages';
import navbar from './Navbar';
import pages from './Pages';
import shortcuts from './Shortcuts';
import explores from './Explores';
import trending from './Trending';
import { ImagePrefixMixin } from './mixins';

export default {
  name: 'home',
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  components: {
    ads, events, explores, feed, navbar, languages, pages, shortcuts, trending,
  },
  data() {
    return {
      selected: {},
    };
  },
  methods: {
    handleScroll() {
      this.scrollPane(document.getElementById('leftnav'));
      this.scrollPane(document.getElementById('rightnav'));
    },
    scrollPane(pane) {
      const headerHeight = 60;
      const rect = pane.getBoundingClientRect();

      if (rect.bottom > window.innerHeight || -window.pageYOffset + headerHeight > rect.top) {
        pane.style.top = `${-window.pageYOffset + headerHeight}px`;
      }
    },
  },
  props: ['me'],
  mixins: [ImagePrefixMixin],
};
</script>
