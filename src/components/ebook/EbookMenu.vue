 <!--此组件设置菜单栏-->
<template>
    <div>
      <transition name="slide-up">
        <!--显示菜单栏，浮在阅读界面下方-->
        <div class="menu-wrapper" :class="{'hide-box-shadow': !menuVisible}" v-show="menuVisible">
          <div class="icon-wrapper">
            <span class="icon-menu" @click="showSetting(3)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-progress" @click="showSetting(2)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-bright" @click="showSetting(1)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-A" @click="showSetting(0)"></span>
          </div>
        </div>
      </transition>
      <ebook-setting-font></ebook-setting-font>
      <ebook-setting-font-popup></ebook-setting-font-popup>
      <ebook-setting-theme></ebook-setting-theme>
      <ebook-setting-progress></ebook-setting-progress>
      <ebook-slide></ebook-slide>
    </div>
</template>

<script>
  import EbookSettingFont from '../../components/ebook/EbookSettingFont.vue'
  import EbookSettingFontPopup from '../../components/ebook/EbookSettingFontPopup.vue'
  import EbookSettingTheme from '../../components/ebook/EbookSettingTheme.vue'
  import EbookSettingProgress from '../../components/ebook/EbookSettingProgress.vue'
  import EbookSlide from '../../components/ebook/EbookSlide.vue'
  import { ebookMixin } from '../../utils/mixin'
  export default {
    mixins: [ebookMixin],
    methods: {
      showSetting (key) {
        this.setSettingVisible(key)
      }
    },
    components: {
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme,
      EbookSettingProgress,
      EbookSlide
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .menu-wrapper {
    z-index: 160;
    // z-index: 200;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    display: flex;
    justify-content: space-around;
    background-color: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    //动态添加样式，当设置栏出现或者菜单栏消失的时候，菜单栏的阴影效果都要消失。此样式应该加在菜单栏上面
    font-size:px2rem(25);
    &.hide-box-shadow {
      box-shadow: none;
    }
    //不设这句的话，会被mask覆盖掉，触发不了click事件
    // z-index: 101;
    .icon-wrapper {
      @include center;
    }
  }
</style>
