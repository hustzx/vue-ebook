 <!--此组件是书城首页搜索部分组件,上面为标题，下面为搜索框-->
<template>
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible, 'hide-shadow':!shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-cn-wrapper" @click="changeLang">
            <span class="icon-cn icon" v-if="lang === 'cn'"></span>
            <span class="icon-en icon" v-else></span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlagCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <!--后退标签与标题不同级的原因是后面的交互中，两者行为不一致，不便被同一元素包裹-->
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <!--左侧占位区域，初始宽度为0-->
        <div class="search-bar-input-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input class="input" type="text" :placeholder="$t('home.hint')" v-model="searchText"
          @click="showHotSearch" @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import HotSearchList from '../../components/home/HotSearchList.vue'
  import { saveLocale } from '../../utils/localStorage'

  export default {
    mixins: [storeHomeMixin],
    components: {
      HotSearchList
    },
    computed: {
      lang () {
        return this.$i18n.locale
      }
    },
    data () {
      return {
        searchText: '',
        titleVisible: true, // 控制标题栏的显示
        shadowVisible: false, // 控制阴影的显示
        hotSearchVisible: false // 控制热门搜索的显示
      }
    },
    watch: {
      // 滚动距离
      offsetY (v) {
        if (v > 0) {
          this.hideTitle();
          this.showShadow()
        } else {
          this.showTitle();
          this.hideShadow()
        }
      },
      hotSearchOffsetY (v) {
        if (v > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
      }
    },
    methods: {
      hideTitle () {
        this.titleVisible = false
      },
      showTitle () {
        this.titleVisible = true
      },
      hideShadow () {
        this.shadowVisible = false
      },
      showShadow () {
        this.shadowVisible = true
      },
      showHotSearch () {
        this.hideTitle();
        this.hideShadow();
        this.hotSearchVisible = true;
        // Vue观察到数据变化时并不会直接更新DOM，而是开启队列，缓冲在同一Event Loop中发生的数据改变，剔除重复，在下一个事件循环中
        // Vue刷新队列执行相关DOM操作。又叫异步更新队列。
        this.$nextTick(() => {
          this.$refs.hotSearch.reset()
        })
      },
      hideHotSearch () {
        this.hotSearchVisible = false;
        // 点击返回按钮时，需要对热门搜索出现前的组件滚动值做判断。如果有滚动，隐藏标题栏，没有滚动则显示标题栏
        if (this.offsetY > 0) {
          this.hideTitle();
          this.showShadow()
        } else {
          this.showTitle();
          this.hideShadow()
        }
      },
      // 返回按钮事件
      back () {
        this.hideHotSearch();
      },
      showFlagCard () {
        this.setFlapCardVisible(true)
      },
      // 搜索功能
      search () {
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
      },
      // 中英文切换
      changeLang () {
        if (this.lang === 'cn') {
          this.$i18n.locale = 'en'
        } else {
          this.$i18n.locale = 'cn'
        }
        saveLocale(this.lang)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .search-bar{
    position: relative;
    z-index: 150; // 因为滚动组件默认z-index为100，滚动时会先覆盖搜索框
    width:100%;
    height:px2rem(94);
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,0.1);
    &.hide-title{ // 滚动时标题栏消失，总高度也要变为搜索栏高度
      height:px2rem(52);
    }
    &.hide-shadow{
      box-shadow: none;
    }
    // 三个部分都采用绝对布局，以方便动画的设计
    .search-bar-title-wrapper{
      height:px2rem(42);
      width:100%;
      position: absolute;
      top:0;
      left:0;
      .title-text-wrapper{
        height:px2rem(42);
        width:100%;
        @include center;
      }
      .title-icon-cn-wrapper{
        position: absolute;
        top:0;
        right:px2rem(50);
        height:px2rem(42);
        @include center
      }
      .title-icon-shake-wrapper{
        position: absolute;
        top: 0;
        right:px2rem(15);
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper{
      position: absolute;
      top: 0;
      left:px2rem(15);
      height: px2rem(42);
      z-index: 200; // 会被搜索栏的占位区覆盖
      @include center;
      transition: height $animationTime $animationType;
      &.hide-title{
        height: px2rem(52); // 标题栏上移后高度与搜索框保持一致,利用图标的居中特性让它下移
      }
    }
    .search-bar-input-wrapper{
      position: absolute;
      left:0;
      top:px2rem(42);
      width:100%;
      height:px2rem(52);
      box-sizing: border-box;
      padding: px2rem(10);
      transition: top $animationTime $animationType;
      display: flex;
      &.hide-title{
        top: 0;
      }
      .search-bar-input-blank{
        flex: 0 0 0;
        max-width:px2rem(31); // 左侧图标宽度16+左边距15
        transition: all $animationTime $animationType;
        &.hide-title{
          flex: 0 0 px2rem(31);
        }
      }
      .search-bar-input{
        flex: 1;
        width:100%;
        background: #f4f4f4;
        border-radius: px2rem(20);
        padding: px2rem(5) px2rem(15);
        box-sizing: border-box;
        border:px2rem(1) solid #eee;
        @include left;
        .icon-search{
          color: #999;
        }
        .input{
          width:100%;
          height:px2rem(22);
          background: transparent;
          border:none;
          margin-left:px2rem(10);
          color: #666;
          font-size:px2rem(12);
          &:focus{
            outline:none;
          }
          // 设置input中的placeholder的样式
          &::-webkit-input-placeholder{
            color:#ccc;
          }
        }
      }
    }
  }
</style>
