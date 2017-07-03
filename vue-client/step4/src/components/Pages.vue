<template>
  <div>
    <div class="bottomborder">Your Pages</div>
    <div v-if="pages[selectedPageIndex]">
      <div class="bottomborder">
        <span class="thumbnail"><img :src="pages[selectedPageIndex].ProfileImage"/></span>
        <a :href="'/pages/' + selectedPageIndex" v-on:mouseenter="waitPopup($event.target, pages[selectedPageIndex], pagePopup)" 
          v-on:mouseleave="waitClearPopup(pagePopup)">{{ pages[selectedPageIndex].Name }}</a>
        <div title="Messages"><a href="/messages" role="button"><i class="fa fa-comments-o"></i> Messages</a></div>
        <div title="Notifications"><a href="/notifications" role="button"><i class="fa fa-bell"></i> Notifications</a></div>
      </div>
      <div class="actions">
        <span title="Publish"><i class="fa fa-edit"></i> Publish</span>
        <span title="Photo"><i class="fa fa-camera"></i> Photo</span>
        <span title="Event"><i class="fa fa-calendar-o"></i> Event</span>
        <span title="Promote"><i class="fa fa-bullhorn"></i> Promote</span>
      </div>
      <div class="tabNav">
        <span>Likes</span>
        <span>Views</span>
        <span>Posts</span>
      </div>
      <div class="tabContent">
        <div name="likes">
          <div class="big">{{ pages[selectedPageIndex].Likes }}</div>
          <div>{{ pages[selectedPageIndex].LikesThisWeek }}</div>
        </div>
        <div name="views">
          <div>{{ getCurrentWeekRange() }}</div>
          <div class="big">
            <span>{{ pages[selectedPageIndex].Views }}</span>
            <span>{{ pages[selectedPageIndex].PostEngagements }}</span>
          </div>
        </div>
        <div name="posts">
          <div>{{ getCurrentWeekRange() }}</div>
          <div class="big">
            <span>{{ pages[selectedPageIndex].PostComments }}</span>
            <span>{{ pages[selectedPageIndex].PostShares }}</span>
          </div>
        </div>
      </div>
      <div class="ad">
        <div class="title">{{ pages[selectedPageIndex].AdTitle }}</div>
        <img :src="pages[selectedPageIndex].ImageURL" /> 
        <div class="description">{{ pages[selectedPageIndex].AdText }}</div>
        <button>{{ pages[selectedPageIndex].AdButtonText }}</button>
      </div>
      <div class="recentPosts">
        <ul>
          <li v-for="item in pages[selectedPageIndex].RecentPosts">
            <img :src="item.ProfileImage"/>
            <div class="title">{{item.Name}}</div>
            <div class="date">{{ item.PostDate | relativeDate }}</div>
            <div class="content">{{ item.Post | truncate(40) }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>Loading</div>
    <div id="pagePopup" class="popup" v-show="pagePopup.visible" v-on:mouseenter="pagePopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(pagePopup)">
      <h1>Page popup</h1>
    </div>
  </div>
</template>

<style>
  .bottomborder {
    border-bottom: 1px solid #aaa;
    padding-bottom: 10px;
  }
  #pages .thumbnail {
    width: 64px;
    float: left;
  }
  #pages .header {
    margin-left: 70px;
    border-bottom: 1px solid #aaa;
  }
  #pages .actions {
    clear: both;
  }
</style>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'pages',
  created() {
    this.getPages();
  },
  data() {
    return {
      pages: [],
      selectedPageIndex: 0,
      pagePopup: { visible: false, elementId: 'pagePopup', preferredLocation: 'left' },
    };
  },
  methods: {
    getPages() {
      axios.get('http://localhost:1234/api/pages').then((response) => {
        this.pages = response.data;
      }).catch((response) => {
        console.log('error', response);
      });
    },
    getCurrentWeekRange() {
      const first = moment().startOf('week');
      const last = moment().endOf('week');
      return `${first.format('MMM D')} - ${last.format('MMM D')}`;
    },
  },
};
</script>
