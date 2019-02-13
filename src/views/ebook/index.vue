 <!--电子书阅读器页面入口组件-->
<template>
    <div class="ebook" ref="ebook">
      <ebook-header></ebook-header>
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
      <ebookmark></ebookmark>
      <ebook-footer></ebook-footer>
    </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader.vue'
  import EbookTitle from '../../components/ebook/EbookTitle.vue'
  import EbookMenu from '../../components/ebook/EbookMenu.vue'
  import Ebookmark from '../../components/ebook/Ebookmark.vue'
  import EbookHeader from '../../components/ebook/EbookHeader.vue'
  import EbookFooter from '../../components/ebook/EbookFooter.vue'
  import { ebookMixin } from '../../utils/mixin'
  import { px2rem } from '../../utils/utils'
  export default {
    mixins: [ebookMixin],
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu,
      Ebookmark,
      EbookHeader,
      EbookFooter
    },
    watch: {
      offsetY (v) {
        if (this.bookAvailable && !this.menuVisible) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    methods: {
      restore () {
        this.$refs.ebook.style.top = 0;
        this.$refs.ebook.style.transition = 'all 0.2s linear';
        setTimeout(() => {
          // 动画执行完后清除动画，不然下次下拉也会持续0.2秒
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      // 整个界面下拉
      move (v) {
        this.$refs.ebook.style.top = `${px2rem(v)}rem`;
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .ebook{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height:100%;
  }
</style>
