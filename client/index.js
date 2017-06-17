new Vue({
  el: '#app',
  beforeCreated() {
  },
  created() {
    this.getFeed();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  data: {
    page: 0,
    data: [],
    hoveringOver: undefined,
    selected: {},
    cardPopup: { visible: false, elementId: 'cardPopup' },
    reactPopup: { visible: false, elementId: 'reactPopup', preferredLocation: 'top' },
    medPrefix: "https://randomuser.me/api/portraits/med/",
    largePrefix: "https://randomuser.me/api/portraits/",
    thumbPrefix: "https://randomuser.me/api/portraits/thumb/",
  },
  methods: {
    handleScroll() {
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // how jquery calculates document height

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
      })
      .catch((err) => {
        this.data = undefined;
        this.error = err.response.data;
      });
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
