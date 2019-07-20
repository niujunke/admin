<template>
  <span @click="handleSelect" style="display: inline-block">
    <span
      @mouseout="mouseout"
      @mouseover="mouseover"
      :style="itemData.selected ? selectStyle : currentStyle "
    >
      <Icon :type="itemData.icon" style="margin-right: 8px"/>
      {{itemData.title}}
    </span>
  </span>
</template>

<script>
export default {
  components: {},
  props: {
    itemData: {
      type: Object,
      required: true
    },
    type: {
      type: Number
    }
  },
  computed: {},
  data () {
    return {
      currentStyle: {
        backgroundColor: '#FFF',
        color: '#495060',
        padding: '3px 8px'
      },
      hoverStyle: {
        backgroundColor: '#2d8cf0',
        color: '#FFF',
        padding: '3px 8px'
      },
      selectStyle: {
        backgroundColor: '#2d8cf0',
        color: '#FFF',
        padding: '3px 8px'
      },
      style: {
        backgroundColor: '#FFF',
        color: '#495060',
        padding: '3px 8px'
      }
    }
        },
  methods: {
    handleSelect () {
      if ((!this.type && this.itemData.isEmployee) || (this.type && (this.type == 1 || this.type == 2))) {
        if (this.itemData.selectFunction) {
          this.itemData.selectFunction({
            id: this.itemData.id,
            name: this.itemData.title
          })
                    }
      }
    },

    listenSelect (obj) {
      if (obj.id === this.itemData.id) {
        this.itemData.selected = true
                } else {
        this.currentStyle = this.style
        this.itemData.selected = false
                }
    },
    mouseover () {
      if (this.itemData.selected == null || (!this.itemData.selected)) {
        this.currentStyle = this.hoverStyle
      }
    },
    mouseout () {
      if (this.itemData.selected == null || (!this.itemData.selected)) {
        this.currentStyle = this.style
      }
    }
  },
  created: function () {
    if (this.itemData.eventbus) {
      this.itemData.eventbus.$on('select', this.listenSelect)
            }
  },
  beforeDestroy: function () {
    if (this.itemData.eventbus) {
      this.itemData.eventbus.$off('select', this.listenSelect)
            }
  },
  mounted () {

  },
  watch: {
  }
}
</script>
