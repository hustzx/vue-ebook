 <!--此组件是下拉时显现的书签组件-->
<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Bookmark from '../../components/common/Bookmark.vue'
  import { realPx, px2rem } from '../../utils/utils'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'
   const BLUE = '#346cbc';
   const WHITE = '#fff';
  export default {
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    data () {
      return {
        text: this.$t('book.pulldownAddMark'),
        color: WHITE,
        isFixed: false // 判断书签是否该固定
      }
    },
    computed: {
      height () { // 下拉超过此值后，书签高度不再发生变化。由于调用了realPx方法，所以存入计算属性中优化性能
        return realPx(35)
      },
      threshold () { // 书签临界点，下拉超过此值后开始添加书签，文字发生变化
        return realPx(55)
      },
      fixedStyle () {
        return {
          position: 'fixed',
          top: 0,
          right: `${px2rem((window.innerWidth - this.$refs.bookmark.clientWidth) / 2)}rem`
        }
      }
    },
    methods: {
      addBookmark () {
        this.bookmark = getBookmark(this.fileName);
        if (!this.bookmark) {
          this.bookmark = [];
        }
        // 获取现在位置信息对象，里面包含页面开始跟结束字符串的路由信息，通过将基础路径，开始路径，结束路径拼接就可以获取整个页面的路径
        const currentLocation = this.currentBook.rendition.currentLocation();
        const cfiBase = currentLocation.start.cfi.replace(/!.*/, '');
        const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfirange = `${cfiBase}!,${cfiStart},${cfiEnd})`;
        // 将拼接的链接范围传入API，将结果转化为字符串
        this.currentBook.getRange(cfirange).then(results => {
          const text = results.toString().replace(/\s\s/g, ''); // 将结果中超过两个的空格替换为一个空格
          this.bookmark.push({ // 将结果存入书签列表
            cfi: currentLocation.start.cfi, // 标记为书签页面的第一个字符路由
            text: text // 标记为书签的页面内容
          });
          saveBookmark(this.fileName, this.bookmark);
          this.setBookmarkList(this.bookmark)
        })
      },
      removeBookmark () {
        const currentLocation = this.currentBook.rendition.currentLocation();
        const cfiStart = currentLocation.start.cfi;
        this.bookmark = getBookmark(this.fileName);
        if (this.bookmark) {
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfiStart));
          this.setBookmarkList(this.bookmark.filter(item => item.cfi !== cfiStart))
        }
        this.setIsBookmark(false)
      },
      // 下拉弹回去时进行归位操作
      restore () {
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${px2rem(-this.height)}rem`;
          this.$refs.iconDown.style.transform = 'rotate(0)';
        }, 200); // 原因是界面下拉反弹时，有一个0.2s的过度动画，也就是说界面弹起并不是立马高度归为0，所以这里同步也要等候0.2s
        if (this.isFixed) {
          this.setIsBookmark(true);
          this.addBookmark()
        } else {
          this.setIsBookmark(false);
          this.removeBookmark()
        }
      },
      beforeHeight () {
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark');
          this.color = BLUE;
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark');
          this.color = WHITE;
          this.isFixed = false
        }
      },
      // 未超过临界点时的操作
      beforeThreshold (v) {
        let iconDown = this.$refs.iconDown;
        this.beforeHeight();
        this.$refs.bookmark.style.top = `${px2rem(-v)}rem`; // 保持书签组件与最顶部相对静止
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      // 超过临界点的操作
      afterThreshold (v) {
        let iconDown = this.$refs.iconDown;
        if (this.isBookmark) {
          this.isFixed = false;
          this.text = this.$t('book.releaseDeleteMark');
          this.color = WHITE
        } else {
          this.text = this.$t('book.releaseAddMark');
          this.color = BLUE;
          this.isFixed = true
        }
        this.$refs.bookmark.style.top = `${px2rem(-v)}rem`;
        if (iconDown.style.transform === 'rotate(0deg)' || iconDown.style.transform === '') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    },
    watch: {
      offsetY (v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible > 0) {
          return
        }
        if (v >= this.height && v < this.threshold) {
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          this.beforeHeight()
        } else if (v === 0) {
          this.restore()
        }
      },
      isBookmark (v) {
        this.isFixed = v;
        if (v) {
          this.color = BLUE
        } else {
         this.color = WHITE
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .ebook-bookmark{
    // 以父元素ebook为定位标准，总是浮在ebook上方35px
    position: absolute;
    top:px2rem(-35);
    left:0;
    width:100%;
    height:px2rem(35);
    // z-index: 300;
    z-index: 200;
    .ebook-bookmark-text-wrapper{
      position: absolute;
      right:px2rem(45);
      bottom:0;
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size:px2rem(14);
        @include center;
        color: white;
        transition: all .2s linear;
      }
      .ebook-bookmark-text{
        font-size:px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right:px2rem(15);
    }
  }
</style>
