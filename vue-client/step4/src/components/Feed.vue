<template>
  <div>
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
  </div>
</template>

<style>
  .post {
    padding: 10px 15px;
  }
  .yellow {
    background-color: #f5dfa3;
  }
  .red {
    background-color: #c5243a;
  }
  .blue {
    background-color: #476ebc;
  }
  .react {
    width: 100%;
    border-top: 1px solid #ddd;
    margin-top: 10px;
  }
  .react > span {
    display: inline-block;
    margin-top: 10px;
    margin-right: 20px;
  }
  .message {
    clear: both;
    margin-top: 5px;
    font-size: 15px;
  }
  .image, .video {
    margin-top: 10px;
  }
  .image > img {
    width: 470px;
  }

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
    background: url('/images/flag.jpg');
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

<script>
import axios from 'axios';
import comments from './Comments';
import { PopupMixin, ImagePrefixMixin } from './mixins';
import { truncate } from './filters';

export default {
  name: 'feed',
  created() {
    this.getFeed();
  },
  components: { comments, truncate },
  data() {
    return {
      page: 0,
      feed: [],
      selected: {},
      cardPopup: { visible: false, elementId: 'cardPopup' },
      reactPopup: { visible: false, elementId: 'reactPopup', preferredLocation: 'top' },
    };
  },
  methods: {
    getFeed() {
      this.page += 1;
      axios.get(`http://localhost:1234/api/feed/${this.page}`).then((response) => {
        this.feed.push(...response.data);
        this.error = undefined;
        // TODO: Remove
        this.selected = this.feed[0];
      }).catch(() => {});
    },
  },
  mixins: [PopupMixin, ImagePrefixMixin],
};
</script>
