new Vue({
  el: '#app',
  beforeCreated() {
  },
  created() {
    this.getFeed();
    this.getLoggedInUser();
    this.getPages();
    this.getTrending();
    this.getEvents();
    this.getAds();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  data: {
    page: 0,
    data: [],
    pages: [],
    selectedPageIndex: 0,
    trending: {},
    trendingCategory: 'News',
    events: [],
    ads: [],
    me: undefined,
    hoveringOver: undefined,
    selected: {},
    cardPopup: { visible: false, elementId: 'cardPopup' },
    reactPopup: { visible: false, elementId: 'reactPopup', preferredLocation: 'top' },
    eventPopup: { visible: false, elementId: 'eventPopup', preferredLocation: 'left' },
    pagePopup: { visible: false, elementId: 'pagePopup', preferredLocation: 'left' },
    trendingPopup: { visible: false, elementId: 'trendingPopup', preferredLocation: 'left' },
    medPrefix: "https://randomuser.me/api/portraits/med/",
    largePrefix: "https://randomuser.me/api/portraits/",
    thumbPrefix: "https://randomuser.me/api/portraits/thumb/",
  },
  methods: {
    handleScroll() {
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // how jquery calculates document height

      if (window.pageYOffset < 1000) {
        rightnav.style.top = -window.pageYOffset + 60;
      }

      if (window.pageYOffset + window.innerHeight >= docHeight - 200) { // fetch data when < 200 px from bottom
        this.getFeed()
      }
    },
    getFeed() {
      this.page++;
      axios.get(`/api/feed/${this.page}`).then((response) => {
        this.data.push(...response.data);
        this.error = undefined;
        // TODO: Remove
        this.selected = this.data[0];
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getLoggedInUser() {
      axios.get('/api/users/me').then((response) => {
        this.me = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getPages() {
      axios.get('/api/pages').then((response) => {
        this.pages = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getTrending() {
      axios.get('/api/events').then((response) => {
        this.events = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getEvents() {
      axios.get('/api/trending').then((response) => {
        this.trending = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    getAds() {
      axios.get('/api/ads').then((response) => {
        this.ads = response.data;
      }).catch((response) => {
        console.log("error", response);
      });
    },
    seeMore(post) {
      this.$set(post, 'seeMore', true);
    },
    filterTrending() {
      return this.trending[this.trendingCategory] ? this.trending[this.trendingCategory].slice(0, 3) : [];
    },
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
  },
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
