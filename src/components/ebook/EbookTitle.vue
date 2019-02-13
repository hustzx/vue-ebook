 <!--此组件设置标题栏-->
<template>
  <!--transition标签用于生成过度动画，需要套住一个有v-show属性的标签，然后动态地为该标签添加六个样式，
  进入离开各有三个样式，分别为前、进行时、后-->
  <transition name="slide-down">
    <!--这个盒子的作用是显示标题栏，浮在阅读界面上方-->
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  export default {
    // 将各个组件需要用的跨组件变量存储在一个地方，减少代码量。vue实例的mixins属性会将ebookMixin对象中混合到实例中去
    mixins: [ebookMixin],
    methods: {
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .title-wrapper{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    // z-index: 210;
    // z-index: 200;
    z-index: 161;
    display: flex;
    background: white;
    //使菜单栏下册出现淡淡阴影
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0,0,0,0.15);
    font-size:px2rem(20);
    .left{
      flex:0 0 px2rem(60);
      @include center;
    }
    .right{
      flex:1;
      //右侧小图标进行弹性布局，向右侧靠拢
      display: flex;
      justify-content: flex-end;
      .icon-wrapper{
        flex: 0 0 px2rem(40);
        @include center;
      }
    }
    //实际上进入离开动画的样式是加在title-wrapper标签上的，所以这里加上&连体符，表示成为了交集选择器
    //在sass中，&代表元素本身。在这里，&就代表.title-wrapper，不加连体符就代表了后代选择器。
    //&后面不能跟上空格，否则就成为了后代选择器。如果&不是行首出现，前面要有空格。
    //当然，也可以把这些样式看做公共样式写入global.scss中
  }
</style>
