<template>
    <div>
      <transition name="slide-up">
        <!--设置面板-->
        <div class="setting-wrapper" v-show="settingVisible === 0 && menuVisible">
          <!--设置字体大小的窗口，里面分为三个部分，中间的是字号选择条，其余的是效果预览-->
          <div class="setting-font-size">
            <div class="preview" :style="{ fontSize : fontSizeList[0].fontSize + 'px'}">A</div>
            <div class="select">
              <!--这里基本结构由两条无高度的横线中间夹杂一根无宽度的竖线实现，并用v-for重复渲染-->
              <div class="select-wrapper" v-for="(item,index) in fontSizeList" :key="index">
                <div class="line"></div>
                <div class="point-wrapper" @click="setFontSize(item.fontSize)">
                  <!--point-wrapper为竖线以及圆点总体，point为小圆点。当item项的fontSize与默认字体大小一样时，就让该项
                  的小圆点显示出来-->
                  <div class="point" v-show="item.fontSize === defaultFontSize">
                    <div class="small-point"></div> <!--中间的小圆-->
                  </div>
                </div>
                <div class="line"></div>
              </div>
            </div>
            <div class="preview" :style="{ fontSize : fontSizeList[fontSizeList.length-1].fontSize + 'px'}">A</div>
          </div>
          <!--设置字体样式的窗口-->
          <div class="setting-font-family" @click="showFontFamilyPopup">
            <div class="setting-font-family-text-wrapper">
              <span class="setting-font-family-text">{{defaultFontFamily}}</span>
            </div>
            <div class="setting-font-family-icon-wrapper">
              <span class="icon-forward"></span>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import { FONT_SIZE_LIST } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'
  import { saveFontSize } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    data () {
      return {
        fontSizeList: FONT_SIZE_LIST
      }
    },
    methods: {
      setFontSize (fontSize) {
        this.setDefaultFontSize(fontSize);
        saveFontSize(this.fileName, fontSize);
        this.currentBook.rendition.themes.fontSize(fontSize)
      },
      showFontFamilyPopup () {
        this.setFontFamilyVisible(true)
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
    //z-index: 101;
    z-index: 160;
    display: flex;
    flex-direction: column;
    .setting-font-size {
      flex: 2;
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        display: flex;
        flex: 1;
        //:first-child为父元素.select的第一个子元素
        :first-child {
          .line {
            //&:first-child等于.line:first-child
            &:first-child {
              border-top: none;
            }
          }
        }
        :last-child {
          .line {
            &:last-child {
              border-top: none;
            }
          }
        }
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            flex: 0 0 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            position: relative;
            .point {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: px2rem(15);
              height: px2rem(15);
              border-radius: 50%;
              border: px2rem(1) solid black;
              background: white;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                border-radius: 50%;
                background: black;
              }
            }
          }
        }
      }
    }
    .setting-font-family{
      flex: 1;
      display: flex;
      font-size:px2rem(14);
      @include center;
      .setting-font-family-text-wrapper{
        @include  center;
        .setting-font-family-text{

        }
      }
      .setting-font-family-icon-wrapper{
        @include  center;
      }
    }
  }
</style>
