 <!--此组件为书城首页摇一摇图标的动画组件-->
<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" v-show="runLoadingAnimation">
      <span class="icon-loading" :class="{'loading-animation':runLoadingAnimation}"></span>
      <div class="point-wrapper">
        <div class="point" v-for="item in pointList" :key="item" :class="{'point-animation':runPointAnimation}"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{category}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import { categoryText } from '../../utils/store'
  export default {
    mixins: [storeHomeMixin],
    props: {
      data: Object
    },
    computed: {
      category: function () {
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      }
    },
    data () {
      return {
        pointList: null,
        runPointAnimation: false,
        runLoadingAnimation: false,
        runBookCardAnimation: false
      }
    },
    methods: {
      close () {
        this.setFlapCardVisible(false);
        this.runBookCardAnimation = false;
        clearTimeout(this.timerPoint);
        clearTimeout(this.timerLoading);
        clearTimeout(this.timerBook)
      }
    },
    watch: {
      flapCardVisible (v) {
        if (v === true) {
          this.runPointAnimation = true;
          this.runLoadingAnimation = true;
          this.timerPoint = setTimeout(() => {
            this.runPointAnimation = false;
          }, 1000);
          this.timerLoading = setTimeout(() => {
            this.runLoadingAnimation = false
          }, 2500);
          this.timerBook = setTimeout(() => {
            this.runBookCardAnimation = true
          }, 2500)
        }
      }
    },
    created () {
      this.pointList = [];
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    },
    beforeDestroy () {
      clearTimeout(this.timerPoint);
      clearTimeout(this.timerLoading);
      clearTimeout(this.timerBook)
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  @import '../../assets/styles/flapCard.scss';
  .flap-card-wrapper{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: 1000; // 覆盖在所有层上面
    background: rgba(0,0,0,0.6);
    @include center;
    .flap-card-bg{
      width:px2rem(64);
      height:px2rem(64);
      border-radius: px2rem(5);
      background: white;
      @include center;
      .icon-loading{
        &.loading-animation{
          animation: loading-move 1s linear infinite;
          @keyframes loading-move {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg)
            }
          }
        }
      }
      .point-wrapper{
        @include absCenter;
        // z-index: 1500;
        .point{
          @include absCenter;
          border-radius: 50%;
          &.point-animation{
            // sass中的循环，遍历1到$moves数组长度
            @for $i from 1 to length($moves) {
              // 通过序选择器选中每一个point元素
              // 注意，在sass中，$开头的变量一般用做属性值，#{}开头的变量用做属性名称或者类名或者选择器
              // #{}类似于es6中的``,可以将不同变量拼接成字符串.在flapCard.scss文件中keyframes的动画名称中，就是这一点的应用
             &:nth-child(#{$i}) {
               @include move($i)
             }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include nowrap-line(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper{
      position: absolute;
      left:0;
      bottom:px2rem(30);
      width: 100%;
      @include center;
      z-index: 1100;
      .icon-close{
        width:px2rem(45);
        height:px2rem(45);
        font-size:px2rem(20);
        border-radius: 50%;
        color: white;
        @include center;
        background: #333;
      }
    }
  }
</style>
