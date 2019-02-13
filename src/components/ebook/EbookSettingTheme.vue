 <!--此组件设置样式主题-->
<template>
    <div>
      <transition name="slide-up">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
          <!--设置主题样式的窗口,里面每个主题有两个部分组成，一个是样式示例，一个是文字说明-->
          <div class="setting-theme">
            <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index">
              <div class="preview" :style="{background:item.style.body.background}"
                   :class="{
                    'selected':item.name === defaultTheme}"></div>
              <div class="text" @click="setTheme(index)" :class="{'selected':item.name === defaultTheme}">{{item.alias}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { saveTheme } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    methods: {
      setTheme (index) {
        const theme = this.themeList[index];
        this.setDefaultTheme(theme.name).then(() => {
          this.currentBook.rendition.themes.select(this.defaultTheme);
          this.initGlobalStyle()
        });
        saveTheme(this.fileName, theme.name)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .setting-wrapper {
    position: absolute;
    //这个高度就是菜单栏的高度，让他浮在菜单栏的上方
    bottom: px2rem(48);
    left: 0;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    background-color: white;
    z-index: 160;
    // z-index: 101;
    .setting-theme{
      display: flex;
      height: 100%;
      .setting-theme-item{
        flex: 1;
        display: flex;
        flex-direction: column;//让预览跟文字纵向排列
        padding: px2rem(5);
        box-sizing: border-box;
        .preview{
          flex:1;
          border: px2rem(1) solid #ccc;
          &.selected{
            box-shadow: 0 px2rem(4) px2rem(6) rgba(0,0,0,.1);
          }
        }
        .text{
          flex:0 0 px2rem(20);
          font-size:px2rem(14);
          color: #ccc;
          @include center;
          //被选中的文字状态
          &.selected{
            color:#000;
          }
        }
      }
    }
  }
</style>
