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
    tooltipVisible: true,
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
    getTooltip(user) {
      let content = 
`<div class="card">
   <img src="${this.largePrefix}${user.ImageURLSuffix}"/>
   <div class="user">
    <div class="name">${user.Name}</div>
    <div class="followers>1256 followers</div>
    <div class="location">
      <i class="fa fa-map-marker"></i>Visited <a href="https://www.google.com/maps/place/Burbank,+CA">Burbank, California</a>
      on Monday
    </div>
    <div class="friends">
      <i class="fa fa-persons"></i>80 mutual friends including <a href="/user/${user.UserID}">Person 1</a>
    </div>
    <div class="footer">
      <button><i class="fa fa-check"></i> Friends <i class="fa fa-sort-down"></i></button>
      <button><i class="fa fa-check"></i> Following <i class="fa fa-sort-down"></i></button>
      <button><i class="fa fa-comments-o"></i> Message</button>
    </div>
</div>`;
      return content;
    },
    mouseover(el, user) {
      this.hoveringOver = el;
      setTimeout(this.toggleTooltip(this, el, user), 750)
    },
    mouseout() {
      this.hoveringOver = undefined;
      this.tooltipVisible = false;
    },
    toggleTooltip(vm, el, user) {
      return function() {
        let headerHeight = 50;
        let margin = 20;
        if (vm.hoveringOver) {
          vm.selected = user;
          vm.tooltipVisible = true;
          
          // run on next tick so that card will already be visible. Otherwise the height of the rectangle is 0
          Vue.nextTick(function () {
            let rect = el.getBoundingClientRect();
            let card = document.getElementById('card')
            let cardHeight = card.getBoundingClientRect().height;
            let displayAbove = window.innerHeight - rect.bottom <= rect.top - headerHeight;

            card.style.top = displayAbove ? rect.top + window.pageYOffset - cardHeight - margin : rect.bottom + window.pageYOffset + margin;
            card.style.left = rect.left;
          })
        }
      }
    }
  },
})
