 <!--这个组件是提供加载动画-->
<template>
    <div class="ebook-loading">
      <div class="ebook-loading-wrapper">
        <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
          <div class="ebook-loading-line-wrapper" v-for="(subitem, subindex) in item" :key="subindex">
            <div class="ebook-loading-line"></div>
            <div class="ebook-loading-mask"></div>
          </div>
        </div>
        <div class="ebook-loading-center"></div>
      </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        data: [ [{}, {}, {}], [{}, {}, {}] ],
        maskWidth: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        lineWidth: [{ value: 16 }, { value: 16 }, { value: 16 }, { value: 16 }, { value: 16 }, { value: 16 }]
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';
  .ebook-loading{ // 书的外框
    position: relative;
    z-index: 400;
    width:px2rem(63);
    height:px2rem(40);
    background: transparent;
    border:px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper{
      display: flex;
      width:100%;
      height:100%;
      .ebook-loading-item{
        flex:1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding:px2rem(7) 0;
        .ebook-loading-line-wrapper{
          flex:1;
          @include left;
          box-sizing: border-box;
          padding: 0 px2rem(7);
          .ebook-loading-line{
            flex:0 0 px2rem(16);
            max-width:px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
          .ebook-loading-mask{
            flex:0 0 0;
            height:px2rem(2);
          }
        }
      }
      .ebook-loading-center{
        position: absolute;
        top: 0;
        left: 50%;
        height:100%;
        width:px2rem(1.5);
        background: #d7d7d7;
      }
    }
  }
</style>
