<template>
  <div>
    <a :href="'/events/'" v-on:mouseenter="waitPopup($event.target, events, eventPopup)" 
      v-on:mouseleave="waitClearPopup(eventPopup)">{{events.length + ' event invites'}}</a>
    <div id="eventPopup" class="popup" v-show="eventPopup.visible" v-on:mouseenter="eventPopup.hoveringOver = $el" v-on:mouseleave="waitClearPopup(eventPopup)">
      <h1>Event popup</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { PopupMixin } from './mixins';

export default {
  name: 'events',
  created() {
    this.getEvents();
  },
  data() {
    return {
      events: [],
      eventPopup: { visible: false, elementId: 'eventPopup', preferredLocation: 'left' },
    };
  },
  methods: {
    getEvents() {
      axios.get('/api/events').then((response) => {
        this.events = response.data;
      }).catch((response) => {
        console.log('error', response);
      });
    },
  },
  mixins: [PopupMixin],
};
</script>
