 <!--此组件设置字体样式弹出面板-->
<template>
  <!--组件分为上下两个部分，上面为标题栏，下面为具体各种字体样式-->
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <div class="ebook-popup-title-text">{{ $t('book.selectFont') }}</div>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-list-item" v-for="(item,index) in fontFamilyList" :key="index"
        @click="setFontFamily(item .font)">
          <div class="ebook-popup-list-item-text" :class="{'selected':isSelected(item)}">
            {{item.font}}
          </div>
          <div class="ebook-popup-list-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { FONT_FAMILY_LIST } from '../../utils/book'
  import { saveFontFamily } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    methods: {
      hide () {
        this.setFontFamilyVisible(false)
      }, // 隐藏字体样式面板
      isSelected (item) {
        return this.defaultFontFamily === item.font
      },
      setFontFamily (fontFamily) {
        this.setDefaultFontFamily(fontFamily);
        saveFontFamily(this.fileName, fontFamily);
        if (fontFamily === 'Default') {
          this.currentBook.rendition.themes.font('Times New Roman')
        } else {
          this.currentBook.rendition.themes.font(fontFamily)
        }
      }
    },
    data () {
      return {
        fontFamilyList: FONT_FAMILY_LIST
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .ebook-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0,.1);
    background: white;
    .ebook-popup-title{
      padding: px2rem(15);
      border-bottom: px2rem(1) solid #b8b9bb;
      box-sizing: border-box;
      text-align: center;
      position: relative; // 给下拉小图标提供定位标准,因为下面设置了小图标垂直居中
      .ebook-popup-title-icon{
        position: absolute;
        top: 0;
        left: px2rem(15);
        height: 100%;
        @include center;
        font-size: px2rem(16);
        font-weight: bold;
      }
      .ebook-popup-title-text{
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper{
      .ebook-popup-list-item{
        display: flex;
        padding: px2rem(15);
        .ebook-popup-list-item-text{
          flex: 1;
          font-size: px2rem(14);
          &.selected{
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-list-item-check{
          flex: 1;
          font-size: px2rem(14);
          text-align: right;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
