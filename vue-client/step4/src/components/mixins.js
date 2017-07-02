import Vue from 'vue';

export const PopupMixin = Vue.extend({
  methods: {
    waitPopup(el, data, config) {
      config.hoveringOver = el;
      this.selected = data;
      const delay = config.inDelay || 750;
      setTimeout(this.showPopup(el, config), delay);
    },
    waitClearPopup(config) {
      config.hoveringOver = undefined;
      const delay = config.outDelay || 750;
      setTimeout(this.clearPopup(config), delay);
    },
    clearPopup(config) {
      return function clearPopup() {
        if (!config.hoveringOver) {
          config.visible = false;
        }
      };
    },
    showPopup(el, config) {
      return function showPopup() {
        if (config.hoveringOver !== el) {  // not same element so exit
          return;
        }

        const headerHeight = 50;
        const margin = 20;
        config.visible = true;

        // run on next tick so that popup will already be visible. Otherwise the height of the rectangle is 0
        Vue.nextTick(() => {
          const rect = el.getBoundingClientRect();
          const popup = document.getElementById(config.elementId);
          const popupHeight = popup.getBoundingClientRect().height;
          const displayAbove = config.preferredLocation === 'top' ?
            rect.top - headerHeight > margin + popupHeight :
            window.innerHeight - rect.bottom <= rect.top - headerHeight;

          popup.style.top = displayAbove ?
            (rect.top + window.pageYOffset) - popupHeight - margin :
            rect.bottom + window.pageYOffset + margin;
          popup.style.left = rect.left;
        });
      };
    },
  },
});

export const ImagePrefixMixin = Vue.extend({
  data() {
    return {
      medPrefix: 'https://randomuser.me/api/portraits/med/',
      largePrefix: 'https://randomuser.me/api/portraits/',
      thumbPrefix: 'https://randomuser.me/api/portraits/thumb/',
    };
  },
});
