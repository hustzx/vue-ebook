 <!--此组件的作用是设置目录蒙版,左边是目录，右边是淡淡背景-->
<template>
  <transition name="fade-slide-right">
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
      <div class="content">
        <!--目录部分垂直布局，上面显示目录高度自适应，下面显示选项卡高度固定-->
        <div class="content-page-wrapper" v-if="bookAvailable">
          <div class="content-page">
            <!--这里:is写法是给is属性绑定一个变量，也就是后面的其实是变量，所以应该写在data属性中-->
            <component :is=" currentTab === 1 ? content : bookmark "></component>
          </div>
          <div class="content-page-tab">
            <div class="content-page-tab-item" :class="{'selected':currentTab === 1}"
            @click="selectTab(1)">{{$t('book.navigation')}}</div>
            <div class="content-page-tab-item" :class="{'selected':currentTab === 2}"
            @click="selectTab(2)">{{$t('book.bookmark')}}</div>
          </div>
        </div>
        <!--当图书加载尚未完成时，渲染此组件-->
        <div class="content-empty" v-else>
          <ebook-loading></ebook-loading>
        </div>
      </div>
      <div class="content-bg" @click="hideTitleAndMenu"></div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import EbookSlideContents from '../../components/ebook/EbookSlideContents.vue'
  import EbookLoading from '../../components/ebook/EbookLoading.vue'
  import EbookSlideBookmark from '../../components/ebook/EbookSlideBookmark.vue'
  export default {
    mixins: [ebookMixin],
    components: {
      EbookLoading
    },
    data () {
      return {
        currentTab: 1, // 当前所选选项卡，1为目录，2为书签
         content: EbookSlideContents,
         bookmark: EbookSlideBookmark
      }
    },
    methods: {
      // 切换选项卡
      selectTab (tab) {
        this.currentTab = tab
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .slide-content-wrapper{
    position: absolute;
    left:0;
    top:0;
    z-index: 300;
    width:100%;
    height:100%;
    display: flex;
    .content{
      flex:0 0 85%;
      max-width: 85%;
      height:100%;
      .content-page-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-page{
          flex: 1;
          width:100%;
          overflow: hidden; // 显示滚动条
        }
        .content-page-tab{
          flex:0 0 px2rem(48);
          width: 100%;
          display: flex;
          .content-page-tab-item{
            flex:1;
            height:100%;
            @include center;
            font-size:px2rem(14);
          }
        }
      }
      .content-empty{
        width:100%;
        height:100%;
        @include center;
      }
    }
    .content-bg{
      flex:0 0 15%;
      max-width: 15%;
      height:100%;
    }
  }
</style>
