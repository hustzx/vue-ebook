 <!--此组件设置进度条-->
<template>
    <div>
      <transition name="slide-up">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
          <div class="setting-progress">
            <div class="progress-wrapper">
              <!--<div class="progress-time-wrapper">-->
                <!--<span class="icon-forward"></span>-->
              <!--</div>-->
              <div class="progress-icon-wrapper">
                <span class="icon-back" @click="prevSection"></span>
              </div>
              <input class="progress" type="range" max="100" min="0" step="1"
                     @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)"
                     :value="progress"
                     :disabled="!bookAvailable" ref="progress">
              <div class="progress-icon-wrapper">
                <span class="icon-forward" @click="nextSection"></span>
              </div>
            </div>
            <div class="text-wrapper">
              <span class="progress-section-text">{{getSectionName}}</span>
              <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  export default {
    mixins: [ebookMixin],
    methods: {
      // 进度信息改变后才会执行这个函数
      onProgressChange (progress) {
        this.setProgress(progress).then(() => {
          this.displayProgress()
        })
      },
      // 进度跳转函数
      displayProgress () {
        // 这里获取到的是所有字符总数百分比对应的那个字符，display渲染时渲染出那个字符所在的页面
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100);
        this.display(cfi)
      },
      // 拖动过程中就会发生
      onProgressInput (progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
      },
      // 更新进度条两边颜色
      updateProgressBg () {
        // const range = document.getElementsByTagName('input')[0];
        // this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        // 给background-size属性加上important指令。因为后面的全局主题样式中用background复合属性会覆盖js设置的background-size
        this.$refs.progress.style.cssText += `background-size: ${this.progress}% 100% !important;`
      },
      // 章节向前跳转
      prevSection () {
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1).then(() => {
            this.displaySection()
          })
        }
      },
      nextSection () {
        // 电子书的spine对象存储着这本书的章节数目
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.setSection(this.section + 1).then(() => {
            this.displaySection()
          })
        }
      },
      displaySection () {
        // 调用epubjs自带的section方法返回上一个章节的内容，存储到一个对象中
        const sectionInfo = this.currentBook.section(this.section);
        if (sectionInfo && sectionInfo.href) {
          // href属性存储了章节的地址，把对象当中的href传入渲染方法当中.渲染完毕后更新进度条信息
          this.display(sectionInfo.href)
        }
      }
    },
    updated () {
      this.updateProgressBg()
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    // z-index: 101;
    z-index: 160;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-time-wrapper{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: px2rem(40);
          @include center; // 不给宽高无法设置居中
          font-size:px2rem(14);
        }
        .progress-icon-wrapper{
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
          -webkit-appearance: none; // 覆盖默认样式
          height: px2rem(2);
          // 线性渐变可以看做是背景图片，最后一个ddd颜色是背景颜色，背景图片会覆盖掉颜色
          //background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd !important;
          // background-size调节背景图片宽高，这里用来调整线性渐变背景，第一个参数控制线性渐变覆盖的宽度，第二个参数为高度
          // 然后js中通过进度来控制线性渐变覆盖的宽度，也就是滑块左右颜色不同
          //background-size: 0 100%;
          margin: 0 px2rem(10); // 防止托动进度时误点击翻页按钮
          &:focus {
            outline: none;
          }
          // 进度条滑块样式
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text{
          @include nowrap;
        }
      }
    }
  }
</style>
