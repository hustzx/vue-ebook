 <!--这个组件是实现目录组件-->
<template>
  <!--分为上中下三部分，上面为搜索框，搜索框里面还有取消按钮，中间是图书信息展示包括封面书名阅读进度-->
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <!--exact属性代表只有按住Enter键才有效，不然按下shift键也有效-->
        <input class="slide-contents-search-input"  type="text" :placeholder="$t('book.searchHint')" v-model='searchText'
        @click="showSearch" @keyup.enter.exact="search">
      </div>
      <div class="slide-contents-search-cancel" @click="hideSearch" v-if="searchVisible">{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
      </div>
    </div>
    <scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
        <span class="slide-contents-item-label" :style="contentItem(item)"
        :class="{'selected':section === index}" @click="display(item.href,displayNav)">{{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <!--这里不能用{{}}解析，因为会将结果统一转换成字符串格式，忽视其中的标签语句-->
      <div class="slide-search-item" v-for="(item,index) in searchList" :key="index"
           v-html="item.excerpt" @click="display(item.cfi, displayNav(true, item.cfi))"></div>
    </scroll>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll.vue'
  import { px2rem } from '../../utils/utils'
  export default {
    mixins: [ebookMixin],
    computed: {
      title: function () {
        if (this.metadata && this.metadata.title) {
          return this.metadata.title
        }
        return ''
      },
      creator: function () {
        if (this.metadata && this.metadata.creator) {
          return this.metadata.creator
        }
        return ''
      }
    },
    components: {
      Scroll
    },
    data () {
      return {
        searchVisible: false,
        searchText: '',
        searchList: null // 搜索结果数组
      }
    },
    methods: {
      // ES6新语法，给highlight参数设默认值
      displayNav (highlight = false, cfi = null) {
        this.hideTitleAndMenu();
        if (highlight) {
          // epubjs中提供了设置高亮的方法
          this.currentBook.rendition.annotations.highlight(cfi)
        }
      },
      showSearch () {
        this.searchVisible = true
      },
      hideSearch () {
        this.searchVisible = false;
        this.searchText = null;
        this.searchList = null
      },
      // 子级目录的缩进
      contentItem (item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
      // 搜索算法，由epubjs官方提供.生成的对象中有cfi与包含关键词的语句
      doSearch (q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results))) // 二维数组降维,apply方法会把形参解构
      },
      search () {
        // 搜索字符串为空的话会将匹配所有字符
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(results => {
            this.searchList = results;
            // 对搜索关键词进行高亮设置。思路是遍历搜索结果数组，将每一项中的关键词用带有类名的html标签替换
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText,
                  `<span class="content-search-text">${this.searchText}</span>`);
              return item
              })
          })
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .ebook-slide-contents{
    font-size:0; // 消除DOM中存在的小空格
    width:100%;
    height:100%;
    .slide-contents-search-wrapper{
      height:px2rem(36);
      width: 100%;
      display: flex;
      box-sizing: border-box;
      margin:px2rem(20) 0 px2rem(10) 0;
      padding:0 px2rem(15);
      .slide-contents-search-input-wrapper{
        flex:1;
        height:100%;
        @include center;
        .slide-contents-search-icon{
          font-size:px2rem(14);
          flex:0 0 px2rem(28);
          @include center;
        }
        .slide-contents-search-input{
          flex:1;
          height:px2rem(32);
          font-size:px2rem(14);
          background: transparent; // 背景色透明
          border:none;
          &:focus{
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel{
        flex:0 0 px2rem(50);
        font-size:px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper{
      display: flex;
      width:100%;
      height:px2rem(90);
      box-sizing: border-box;
      padding:px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      .slide-contents-book-img-wrapper{
        flex:0 0 px2rem(45);
        .slide-contents-book-img{
          width:px2rem(45);
          height:px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper{
        flex:1;
        box-sizing: border-box;
        padding:0 px2rem(10);
        .slide-contents-book-title{
          // 这里一行显示必须给定宽度,不然会撑开一行
          // 375*0.85-15*2-10*2-45-70=153.75
          // width: px2rem(153.75);
          font-size:px2rem(14);
          @include left;
          .slide-contents-book-title-text{
            @include nowrap-line(2);
          }
        }
        .slide-contents-book-author{
          font-size:px2rem(12);
          // width: px2rem(153.75);
          margin-top:px2rem(5);
          @include left;
          .slide-contents-book-author-text{
            @include nowrap-line(1);
          }
        }
      }
      .slide-contents-book-progress-wrapper{
        flex:0 0 px2rem(70);
        .slide-contents-book-progress{
          width:100%;
          height:100%;
          @include center;
          .progress{
            font-size:px2rem(14);
          }
          .progress-text{
            font-size:px2rem(12);
          }
        }
      }
    }
    .slide-contents-list{
      box-sizing: border-box;
      padding: 0 px2rem(15);
      .slide-contents-item{
        box-sizing: border-box;
        padding:px2rem(20) 0;
        display: flex;
        .slide-contents-item-label{
          font-size:px2rem(14);
          // flex: 0 0 px2rem(300);
          flex:1;
          @include nowrap;
        }
      }
    }
    .slide-search-list{
      width:100%;
      box-sizing: border-box;
      padding:0 px2rem(15);
      .slide-search-item{
        font-size:px2rem(14);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
