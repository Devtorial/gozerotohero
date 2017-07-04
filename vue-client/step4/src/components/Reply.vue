<template>
  <div class="reply">
    <ul>
      <li v-for="reply in replies">
        <div class="reply">
          <img :src="thumbPrefix + reply.ProfileImage" class="avatar img32" />
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
  </div>
</template>

<style>
  .reply > ul {
    margin: 10px 0 0 0;
  }
</style>  

<script>
import { PopupMixin, ImagePrefixMixin } from './mixins';

export default {
  name: 'reply',
  props: ['replies', 'postid', 'cardPopup', 'reactPopup'],
  mixins: [PopupMixin, ImagePrefixMixin],
};
</script>

