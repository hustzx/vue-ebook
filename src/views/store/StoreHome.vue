 <!--书城首页组件-->
<template>
  <div class="store-home">
    <search-bar></search-bar>
    <!--标题栏下是一个滚动组件，滚动组件里-->
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <!--做成轮播图-->
      <div class="banner-wrapper">
        <!--<div class="banner-image" :style="{backgroundImage: `url('${this.banner}')`}"></div>-->
        <div class="banner-image">
          <div class="point-wrapper">
            <div class="point" v-for="(item, index) in pointList" :key="index" :class="{'selected':index === nowIndex}"
            @click="changeImg(index)"></div>
          </div>
          <span class="icon-back icon" @click="turnImg"></span>
          <span class="icon-forward icon" @click="turnImg"></span>
        </div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend" class="recommend"></recommend>
      <featured :data="featured" class="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categories" class="category"></category>
    </scroll>
    <flap-card :data="random"></flap-card>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar.vue'
  import Scroll from '../../components/common/Scroll.vue'
  import FlapCard from '../../components/home/FlapCard.vue'
  import GuessYouLike from '../../components/home/GuessYouLike.vue'
  import Recommend from '../../components/home/Recommend.vue'
  import Featured from '../../components/home/Featured.vue'
  import CategoryBook from '../../components/home/CategoryBook.vue'
  import Category from '../../components/home/Category.vue'
  import { storeHomeMixin } from '../../utils/mixin'
  import { home } from '../../api/store'
  export default {
    mixins: [storeHomeMixin],
    components: {
      SearchBar,
      Scroll,
      FlapCard,
      GuessYouLike,
      Recommend,
      Featured,
      CategoryBook,
      Category
    },
    data () {
      return {
        scrollTop: 94, // 默认是上方search-bar初始高度
        random: null, // 生成的随机电子书对象
        // banner: '', // 图片地址,bgimg不能接收一个null值，不然会报错
        banner: ['', ''],
        guessYouLike: null, // 猜你喜欢数据
        recommend: null, // 推荐图书数据
        featured: null, // 精选图书数据
        categoryList: null, // 图书列表
        categories: null, // 图书所有分类
        nowIndex: 0, // 现在的图片索引号
        pointList: [{}, {}] // 切换图片的小圆点列表，方便v-for循环生成
      }
    },
    methods: {
      onScroll (offsetY) {
        this.setOffsetY(offsetY);
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      },
      // 定时器事件
      interval () {
        this.timer = setInterval(() => {
          this.nowIndex++;
          if (this.nowIndex === this.banner.length) {
            this.nowIndex = 0
          }
          this.oImg.style.backgroundImage = `url(${this.banner[this.nowIndex]})`
        }, 2000)
      },
      // 点击小圆点切换图片
      changeImg (index) {
        this.nowIndex = index;
        this.oImg.style.backgroundImage = `url('${this.banner[this.nowIndex]}')`;
        clearInterval(this.timer);
        this.interval()
      },
      initImg () {
        this.oImg = document.getElementsByClassName('banner-image')[0];
        this.oImg.style.backgroundImage = `url(${this.banner[0]})`;
        this.interval()
      },
      // 点击后退前进图标切换图片。这里只有两张图片，前进跟后退没有区别
      turnImg () {
        this.nowIndex++;
        if (this.nowIndex === this.banner.length) {
          this.nowIndex = 0
        }
        this.oImg.style.backgroundImage = `url(${this.banner[this.nowIndex]})`;
        clearInterval(this.timer);
        this.interval()
      }
    },
    mounted () {
      // axios请求最终都是异步处理
      home().then(response => {
        if (response && response.status === 200) {
          const data = response.data;
          const randomIndex = Math.floor(Math.random() * data.random.length); // 生成一个随机数
          this.random = data.random[randomIndex];
          this.banner = data.banner;
          this.guessYouLike = data.guessYouLike;
          this.recommend = data.recommend;
          this.featured = data.featured;
          this.categoryList = data.categoryList;
          this.categories = data.categories
        }
      });
      this.initImg()
    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .store-home{
    width:100%;
    height:100%;
    .banner-wrapper{
      width:100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-image{
        background-size: 100% 100%; // 图片自适应
        height:px2rem(150);
        background-repeat: no-repeat;
        position: relative;
        .point-wrapper{
          position: absolute;
          bottom: px2rem(10);
          left: 50%;
          transform: translate3d(-50%, 0, 0); // 实现水平居中
          border-radius: px2rem(3);
          // height: px2rem(10);
          display: flex;
          background: #eeeeee;
          opacity: 0.5;
          box-sizing: border-box;
          .point{
            flex: 1;
            width: px2rem(8);
            height:px2rem(8);
            border-radius: 50%;
            background: #292421;
            margin-right:px2rem(1);
            margin-left: px2rem(1);
            &.selected{
              background: red;
            }
          }
        }
        .icon-back{
          position: absolute;
          left: px2rem(10);
          bottom: 50%;
          transform: translate3d(0,50%,0);
        }
        .icon-forward{
          position: absolute;
          right: px2rem(10);
          bottom: 50%;
          transform: translate3d(0,50%,0);
        }
      }
    }
    .recommend{
      margin-top:px2rem(10)
    }
    .featured{
      margin-top:px2rem(10)
    }
    .category-list-wrapper{
      margin-top: px2rem(10);
    }
    .category{
      margin-top: px2rem(10);
    }
  }
</style>
