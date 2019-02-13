 <!--这个组件的作用是提供公用滚动组件，接收top与bottom参数，确定组件之外的高度-->
<template>
  <!--passive修饰符主要用来提升移动端性能，滚动事件的默认行为会立即触发不会等待onscroll事件完成后才触发。会忽略阻止默认行为-->
  <div class="scroll-wrapper" :class="{'no-scroll': ifNoScroll}" @scroll.passive="handleScroll" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'
  export default {
    props: {
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      ifNoScroll: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      // 处理滚动事件
      handleScroll (e) {
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop;
        this.$emit('onScroll', offsetY)
      },
      scrollTo (x, y) {
        this.$refs.scrollWrapper.scrollTo(x, y)
      },
      refresh () {
        if (this.$refs.scrollWrapper) {
          this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px';
          this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .scroll-wrapper {
    position: relative;
    z-index: 100;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; // 移动端减少滚动卡顿
    &::-webkit-scrollbar {
      display: none;
    }
    &.no-scroll {
      overflow: hidden;
    }
  }
</style>
