<template>
  <div class="comments" v-if="comments.length > 0">
    <div class="summary">
      <a :href="comments[0].Name" v-on:mouseenter="waitPopup($event.target, comments[0], cardPopup)" v-on:mouseleave="waitClearPopup(cardPopup)">{{ comments[0].Name }}</a> and <a href="details">{{ comments.length }} others</details></a>
    </div>
    <ul>
      <li v-for="comment in comments">
        <div class="comment">
          <img :src="thumbPrefix + comment.ProfileImage" class="avatar img32" />
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
  </div>
</template>>

<style>  
  .comments {
    padding: 10px 15px;
    background-color: #eee;
  }
  .comments .summary {
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .comment {
    margin-top: 5px;
    font-size: 13px;
  }
  .comment > div {
    margin-left: 40px;
  }
</style>

<script>
import { PopupMixin, ImagePrefixMixin } from './mixins';
import reply from './FeedReply';

export default {
  name: 'comments',
  components: { reply },
  props: ['comments', 'postid', 'cardPopup', 'reactPopup'],
  mixins: [PopupMixin, ImagePrefixMixin],
};
</script>
