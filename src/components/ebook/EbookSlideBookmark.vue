 <!--此组件是书签列表组件-->
<template>
  <div class="ebook-slide-bookmark">
    <!--展示书签数目-->
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} · {{bookmarkList ? bookmarkList.length : 0}}</div>
    <div class="slide-bookmark-wrapper">
      <scroll class="slide-bookmark-list" :top="48" :bottom="48"
              v-if="bookmarkList ? (bookmarkList.length === 0 ? false : true) : false ">
        <div class="slide-bookmark-item" v-for="(item, index) in bookmarkList" :key="index" @click="displayBookmark(item.cfi)">
          <div class="slide-bookmark-item-icon">
            <div class="icon-bookmark"></div>
          </div>
          <div class="slide-bookmark-item-text">{{item.text}}</div>
        </div>
      </scroll>
      <div class="slide-bookmark-empty" v-else>
        <div class="slide-bookmark-empty-wrapper">
          <div class="slide-bookmark-empty-icon"><span class="icon-empty"></span></div>
          <span class="slide-bookmark-empty-text">这里什么都没有，赶快去添加书签吧！</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import { getBookmark } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    components: {
      Scroll
    },
//    data () {
//      return {
//        bookmark: null
//      }
//    },
    methods: {
      displayBookmark (target) {
        this.display(target, () => {
          this.hideTitleAndMenu()
        })
      }
    },
//    mounted () {
//       this.bookmark = getBookmark(this.fileName)
//    }
    created () {
      this.setBookmarkList(getBookmark(this.fileName))
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .ebook-slide-bookmark {
    width: 100%;
    height:100%;
    .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include left;
    }
    .slide-bookmark-wrapper{
      width:100%;
      height:100%;
      .slide-bookmark-list {
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .slide-bookmark-item {
          display: flex;
          padding: px2rem(15) 0;
          box-sizing: border-box;
          .slide-bookmark-item-icon {
            flex: 0 0 px2rem(29);
            @include left;
            .icon-bookmark {
              width: px2rem(20);
              height: px2rem(20);
              font-size: px2rem(12);
              border-radius: 50%;
              background: #bbb;
              @include center;
            }
          }
          .slide-bookmark-item-text {
            font-size: px2rem(14);
            line-height: px2rem(15);
            max-height: px2rem(45);
            @include nowrap-line(3);
          }
        }
      }
      .slide-bookmark-empty{
        width:100%;
        height:100%;
        @include center;
        .slide-bookmark-empty-wrapper{
          text-align: center;
          .slide-bookmark-empty-icon{
            font-size:px2rem(80);
          }
          .slide-bookmark-empty-text{
            font-size:px2rem(18);
          }
        }
      }
    }
  }
</style>
