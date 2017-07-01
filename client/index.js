var popupMixin = Vue.extend({
  methods: {
    waitPopup(el, data, config) {
      config.hoveringOver = el;
      this.selected = data;
      var delay = config.inDelay || 750;
      setTimeout(this.showPopup(el, config), delay);
    },
    waitClearPopup(config) {
      config.hoveringOver = undefined;
      var delay = config.outDelay || 750;
      setTimeout(this.clearPopup(config), delay);
    },
    clearPopup(config) {
      return function() {
        if (!config.hoveringOver) {
          config.visible = false;
        }
      }
    },
    showPopup(el, config) {
      return function() {
        if (config.hoveringOver != el) {  // not same element so exit
          return;
        }

        let headerHeight = 50;
        let margin = 20;
        config.visible = true
          
        // run on next tick so that popup will already be visible. Otherwise the height of the rectangle is 0
        Vue.nextTick(function () {
          let rect = el.getBoundingClientRect();
          let popup = document.getElementById(config.elementId)
          let popupHeight = popup.getBoundingClientRect().height;
          let displayAbove = config.preferredLocation === 'top' ? rect.top - headerHeight > margin + popupHeight : window.innerHeight - rect.bottom <= rect.top - headerHeight;

          popup.style.top = displayAbove ? rect.top + window.pageYOffset - popupHeight - margin : rect.bottom + window.pageYOffset + margin;
          popup.style.left = rect.left;
        })
      }
    }
  }
})

var imagePrefixMixin = Vue.extend({
  data() {
    return {
      medPrefix: "https://randomuser.me/api/portraits/med/",
      largePrefix: "https://randomuser.me/api/portraits/",
      thumbPrefix: "https://randomuser.me/api/portraits/thumb/",
    }
  }
})

new Vue({
  el: '#app',
  created() {
    this.getLoggedInUser();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  data: {
    me: undefined,
    selected: {},
    pagePopup: { visible: false, elementId: 'pagePopup', preferredLocation: 'left' },
  },
  methods: {
    handleScroll() {
      this.scrollPane(document.getElementById('leftnav'));
      this.scrollPane(document.getElementById('rightnav'));
      this.infiniteScroll();
    },
    scrollPane(pane) {
      let headerHeight = 60;
      let rect = pane.getBoundingClientRect();

      if (rect.bottom > window.innerHeight || -window.pageYOffset + headerHeight > rect.top) {
        pane.style.top = (-window.pageYOffset + headerHeight) + 'px';
      } 
    },
    infiniteScroll() {
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // how jquery calculates document height
      if (window.pageYOffset + window.innerHeight >= docHeight - 200) { // fetch data when < 200 px from bottom
        this.getFeed()
      }
    },
    getLoggedInUser() {
      axios.get('/api/users/me').then((response) => {
        this.me = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
  },
  mixins: [popupMixin, imagePrefixMixin]
})

Vue.component('reply', {
  template: `<div class="reply">
    <ul>
      <li v-for="reply in replies">
        <div class="reply">
          <img :src="thumbPrefix + reply.ProfileImage" class="avatar" />
          <div>
            <a :href="'/user/'+reply.UserID" v-on:mouseenter="waitPopup($event.target, reply, cardPopup)" v-on:mouseleave="waitClearPopup(cardPopup)">{{ reply.Name }}</a>
            {{ reply.Post }}
            <div>
              <span><a href="like" v-on:mouseenter="waitPopup($event.target, reply, reactPopup)" v-on:mouseleave="waitClearPopup(reactPopup)">Like</a></span>
              <span role="presentation" aria-hidden="true"> · </span>
              <span><a href="reply">Reply</a></span>
              <span role="presentation" aria-hidden="true"> - </span>
              <span class="date"><a :href="'/post/'+postid" :title="reply.PostDate | formatDate">{{ reply.PostDate | relativeDate }}</a></span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>`,
  props: ['replies', 'postid', 'cardPopup', 'reactPopup'],
  mixins: [popupMixin, imagePrefixMixin]
})

Vue.component('comments', {
  template: `<div class="comments" v-if="comments.length > 0">
    <div class="summary">
      <a :href="comments[0].Name" v-on:mouseenter="waitPopup($event.target, comments[0], cardPopup)" v-on:mouseleave="waitClearPopup(cardPopup)">{{ comments[0].Name }}</a> and <a href="details">{{ comments.length }} others</details>
    </div>
    <ul>
      <li v-for="comment in comments">
        <div class="comment">
          <img :src="thumbPrefix + comment.ProfileImage" class="avatar" />
          <div>
            <a :href="'/user/'+comment.UserID" v-on:mouseenter="waitPopup($event.target, comment, cardPopup)" v-on:mouseleave="waitClearPopup(cardPopup)">{{ comment.Name }}</a> {{ comment.Post }}
            <div>
              <span><a href="like" v-on:mouseenter="waitPopup($event.target, comment, reactPopup)" v-on:mouseleave="waitClearPopup(reactPopup)">Like</a></span>
              <span role="presentation" aria-hidden="true"> · </span>
              <span><a href="reply">Reply</a></span>
              <span role="presentation" aria-hidden="true"> - </span>
              <span class="date"><a :href="'/post/'+postid" :title="comment.PostDate | formatDate">{{ comment.PostDate | relativeDate }}</a></span>
            </div>
          </div>
          <reply :replies="comment.Comments" :postid="postid" :cardPopup="cardPopup" :reactPopup="reactPopup"></reply>
        </div>
      </li>
    </ul>
  </div>`,
  props: ['comments', 'postid', 'cardPopup', 'reactPopup'],
  mixins: [popupMixin, imagePrefixMixin]
})

Vue.component('feed', {
  template: `<div>
  <style>
    #reactPopup {
      width: 370px;
      border-radius: 20px;
      background-color: #FFF;
      padding: 5px 10px;
    }
    #reactPopup .fa {
      font-size: 25px;
      line-height: 40px;
      color: white;
    }
    #reactPopup .yellow .fa {
      color: black;
    }
    #reactPopup .circle {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: inline-block;
      margin: 0 10px 0 0;
    }
    #cardPopup {
      width: 370px;
      background: url('flag.jpg');
      background-size: 370px 137px;
      background-repeat: no-repeat;
      background-color: #FFF;
    }
    #cardPopup > img {
      width: 100px;
      float: left;
      margin: 90px 8px 40px 10px;
      padding: 5px;
      border: 1px solid #bbb;
      background-color: #FFF;
    }
    #cardPopup .gradient {
      margin-top: 43px;
      height: 93px;
      width: 100%;
      position: absolute;
      z-index: -1;
      background-image: linear-gradient(transparent, rgba(0,0,0,.1) 20%, rgba(0,0,0,.2) 33%, rgba(0,0,0,.35) 50%, rgba(0,0,0,.56) 75%, rgba(0,0,0,.7));
    }
    #cardPopup .user {
      margin: 100px 10px 0 110px;
    }
    #cardPopup .name {
      color: #fff;
      font-size: 16px;
      font-weight: 900;
    }
    #cardPopup .footer {
      background-color: #ddd;
      clear: both;
      height: 30px;
      padding: 5px 0 0 60px;
    }
    #cardPopup .statuses {
      margin: 25px 10px 0 16px;
      font-size: 12px;
    }
    #cardPopup .status {
      margin-bottom: 10px;
    }
    #cardPopup .fa, #cardPopup .footer {
      font-size: 12px;
    }
  </style>
    <ul v-show="feed" class="list-group">
      <li class="list-group-item" v-for="item in feed">
        <div class="post">
          <img :src="thumbPrefix + item.ProfileImage" class="avatar" />
          <div><a :href="'/user/'+item.UserID" v-on:mouseenter="waitPopup($event.target, item, cardPopup)" v-on:mouseleave="waitClearPopup(cardPopup)">{{ item.Name }}</a></div>
          <div class="date"><a :href="'/post/'+item.PostID" :title="item.PostDate | formatDate">{{ item.PostDate | relativeDate }}</a></div>
          <div class="message" v-if="item.Post.length > 480 && !item.seeMore">{{ item.Post | truncate }} <a v-on:click="$set(item, 'seeMore', true);">See More</a></div>
          <div class="message" v-else>{{ item.Post }}</div>
          <div class="image" v-if="item.SharedImage"><img :src="item.SharedImage"/></div>
          <div class="video" v-if="item.SharedVideo"><iframe width="470" height="315" :src="item.SharedVideo"></iframe></div>
          <div class="react">
            <span><a href="like" v-on:mouseenter="waitPopup($event.target, item, reactPopup)" v-on:mouseleave="waitClearPopup(reactPopup)" title="Like"><i class="fa fa-thumbs-o-up"></i> Like</a></span>
            <span><i class="fa fa-comment-o" title="Comment"></i> Comment</span>
          </div>
        </div>
        <comments :comments="item.Comments" :postid="item.PostID" :cardPopup="cardPopup" :reactPopup="reactPopup"></comments>
      </li>
    </ul>
    <div id="reactPopup" class="popup" v-show="reactPopup.visible" v-on:mouseenter="reactPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(reactPopup)">
      <span class="circle blue"><i class="fa fa-thumbs-up"></i></span>
      <span class="circle red"><i class="fa fa-heart"></i></span>
      <span class="circle yellow"><i class="fa fa-smile-o"></i></span>
      <span class="circle yellow"><i class="fa fa-smile-o"></i></span>
      <span class="circle yellow"><i class="fa fa-frown-o"></i></span>
      <span class="circle yellow"><i class="fa fa-frown-o"></i></span>
    </div>
    <div id="cardPopup" class="popup" v-show="cardPopup.visible" v-on:mouseenter="cardPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(cardPopup)">
      <img :src="this.largePrefix + selected.ProfileImage" v-if="selected.ProfileImage"/>
      <div class="gradient"></div>
      <div class="user">
        <div class="name">{{selected.Name}}</div>
        <div class="statuses">
          <div class="status">
            <i class="fa fa-map-marker"></i>
            <div class="action">
              Visited <a href="https://www.google.com/maps/place/Burbank,+CA">Burbank, California</a>
              <div class="time">on Monday</div>
            </div>
          </div>
          <div class="status">
            <i class="fa fa-user"></i>
            <div class="action">80 mutual friends including <a :href="'/user/'+selected.UserID">Person 1</a></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <button><i class="fa fa-check"></i> Friends <i class="fa fa-sort-down"></i></button>
        <button><i class="fa fa-check"></i> Following <i class="fa fa-sort-down"></i></button>
        <button><i class="fa fa-comments-o"></i> Message</button>
      </div>
    </div>
  </div>`,
  created() {
    this.getFeed();
  },
  data() {
    return {
      page: 0,
      feed: [],
      selected: {},
      cardPopup: { visible: false, elementId: 'cardPopup' },
      reactPopup: { visible: false, elementId: 'reactPopup', preferredLocation: 'top' },
    }
  },
  methods: {
    getFeed() {
      this.page++;
      axios.get(`/api/feed/${this.page}`).then((response) => {
        this.feed.push(...response.data);
        this.error = undefined;
        // TODO: Remove
        this.selected = this.feed[0];
      }).catch((response) => {
        console.log("error", response);
      });
    },
  },
  mixins: [popupMixin, imagePrefixMixin]
})

Vue.component('trending', {
  template: `<div class="trending">
  <style>
    .trending li:hover .title {
      text-decoration: underline;
    }
    .trending i {
      margin-left: 10px;
      color: #337ab7;
      float: left;
    }
    .trending article {
      margin-left: 30px;
    }
    .trending a:hover {
      text-decoration: none;
    }
    .trending .title {
      font-weight: bold;
    }
    .trendingTypes {
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .trendingTypes i {
      color: darkgray;
      padding: 5px;
    }
    .trendingTypes i:hover {
      color: #337ab7;
    }
    .trendingTypes i.selected {
      border-bottom: 1px solid #337ab7;
      color: #337ab7;
    }
  </style>
    <h1>Trending</h1>
    <span class="trendingTypes">
      <i class="fa fa-line-chart" :class="{ selected:trendingCategory=='News' }" title="News" v-on:click="setTrendingCategory('News')"></i>
      <i class="fa fa-institution" :class="{ selected:trendingCategory=='Politics' }" title="Politics" v-on:click="setTrendingCategory('Politics')"></i>
      <i class="fa fa-flask" :class="{ selected:trendingCategory=='Tech' }" title="Science and Technology" v-on:click="setTrendingCategory('Tech')"></i>
      <i class="fa fa-futbol-o" :class="{ selected:trendingCategory=='Sports' }" title="Sports" v-on:click="setTrendingCategory('Sports')"></i>
      <i class="fa fa-film" :class="{ selected:trendingCategory=='Entertainment' }" title="Entertainment" v-on:click="setTrendingCategory('Entertainment')"></i>
    </span>
    <ul>
      <li v-for="item in trendingFiltered" v-on:mouseenter="waitPopup($event.target, item, trendingPopup)" v-on:mouseleave="waitClearPopup(trendingPopup)">
        <i class="fa fa-bolt"></i>
        <a :href="item.Url"><article><div class="title">{{item.Title | truncate(25) }}</div>
        <div class="description">{{item.Description | truncate(55) }} <span class="grey">- {{item.Url | urlDomain }}</span></div></article></a>
      </li>
      <li v-if="trendingFiltered.length == 3"><a v-on:click="trendingFiltered = trending[trendingCategory];"><i class="fa fa-caret-down"></i> See More...</a></li>
    </ul>
    <div id="trendingPopup" class="popup" v-show="trendingPopup.visible" v-on:mouseenter="trendingPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(trendingPopup)">
      <h1>Trending popup</h1>
    </div>
  </div>`,
  created() {
    this.getTrending();
  },
  data() {
    return {
      trending: {},
      trendingFiltered: [],
      trendingCategory: 'News',
      trendingPopup: { visible: false, elementId: 'trendingPopup', preferredLocation: 'left' },
    }
  },
  methods: {
    getTrending() {
      axios.get('/api/trending').then((response) => {
        this.trending = response.data;
        this.trendingFiltered = this.trending[this.trendingCategory].slice(0, 3);
      }).catch((response) => {
        console.log("error", response);
      });
    },
    setTrendingCategory(category) {
      this.trendingCategory = category;
      this.trendingFiltered = this.trending[category];
    },
  },
  mixins: [popupMixin]
})

Vue.component('ads', {
  template: `<div>
    <h1>Ads</h1>
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
  </div>`,
  created() {
    this.getAds();
  },
  data() {
    return {
      ads: [],
      adsPopup: { visible: false, elementId: 'adsPopup', preferredLocation: 'left' },
    }
  },
  methods: {
    getAds() {
      axios.get('/api/ads').then((response) => {
        this.ads = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
  },
  mixins: [popupMixin]
})

Vue.component('events', {
  template: `<div>
    <a :href="'/events/'" v-on:mouseenter="waitPopup($event.target, events, eventPopup)" 
      v-on:mouseleave="waitClearPopup(eventPopup)">{{events.length + ' event invites'}}</a>
    <div id="eventPopup" class="popup" v-show="eventPopup.visible" v-on:mouseenter="eventPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(eventPopup)">
      <h1>Event popup</h1>
    </div>
  </div>`,
  created() {
    this.getEvents();
  },
  data() {
    return {
      events: [],
      eventPopup: { visible: false, elementId: 'eventPopup', preferredLocation: 'left' },
    }
  },
  methods: {
    getEvents() {
      axios.get('/api/events').then((response) => {
        this.events = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
  },
  mixins: [popupMixin]
})

Vue.component('pages', {
  template: `<div>
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
            <img src="endfirst.png"/>
            <div class="title">EndFirst</div>
            <div class="date">{{ item.PostDate | relativeDate }}</div>
            <div class="content">{{ item.Post | truncate(40) }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>Loading</div>
  </div>`,
  name: 'pages',
  created() {
    this.getPages();
  },
  data() {
    return {
      pages: [],
      selectedPageIndex: 0
    }
  },
  methods: {
    getPages() {
      axios.get('/api/pages').then((response) => {
        this.pages = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getCurrentWeekRange() {
      var first = moment().startOf('week');
      var last = moment().endOf('week');
      return first.format("MMM D" + " - " + last.format("MMM D"))
    },
  }
});

Vue.component('shortcuts', {
  template: `<div>
    <div class="header">Shortcuts</div>
    <ul>
      <li v-for="item in shortcuts"><span class="icon"></span>{{item.Name | truncate(15)}}</li>
    </ul>
  </div>`,
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
})

Vue.component('explores', {
  template: `<div>
    <div class="header">Explore</div>
    <ul>
      <li v-for="item in exploresFiltered || explores"><span class="icon"><i :class="'fa '+item.Icon"></i></span> {{item.Name | truncate(15)}}</li>
      <a v-on:click="exploresFiltered = undefined"><li v-if="exploresFiltered"><i class="fa fa-caret-down"></i> See More...</li></a>
    </ul>
  </div>`,
  created() {
    this.getExplores();
  },
  data() {
    return {
      explores: [],
      exploresFiltered: [],
    }
  },
  methods: {
    getExplores() {
      axios.get('/api/explores').then((response) => {
        this.explores = response.data;
        this.exploresFiltered = this.explores.slice(0, 10);
      }).catch((response) => {
        console.log("error", response);
      });
    },
  }
})

Vue.component('languages', {
  template: `<div>
  English (US) · <a>Espanol</a> · <a>Portugues (Brasil)</a> · <a>Francais (France)</a> · <a>Deutsch</a>
  </div>`
})

Vue.filter('relativeDate', function(value) {
  if (value) {
    return moment(String(value)).fromNow()
  }
})

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('dddd MMMM Do, YYYY [at] h:mma');
  }
})

Vue.filter('truncate', function(value, length = 480) {
  if (value) {
    return value.length > length ? value.substring(0, length) + "..." : value;
  }
})

Vue.filter('urlDomain', function(value) {
  if (value) {
    let domainStart = value.indexOf("//")+2
    return value.substring(domainStart, value.indexOf("/", domainStart));
  }
})
