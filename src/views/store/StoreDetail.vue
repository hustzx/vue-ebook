 <!--此组件为书城详情页组件/store/detail-->
<template>
  <div class="book-detail">
    <detail-title @back="back" :showShelf="true" ref="title"></detail-title>
    <scroll class="content-wrapper" :top="42" :bottom="52" @onScroll="onScroll" ref="scroll">
      <book-info :cover="cover" :title="title" :author="author" :desc="desc"></book-info>
      <!--图书详细信息包裹，第一个是图书版权信息-->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <!--可以考虑将每一行抽象成一个组件，传入不同的值，这样可简化代码-->
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <!--图书详细信息包裹，第二个是图书目录信息-->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <!--目录不存在时，显示加载-->
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <!--目录包裹层-->
          <div class="book-detail-content-item-wrapper">
            <!--单击目录跳转进入阅读器界面，这是目录每行包裹层-->
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="read(item)">
              <!--具体的目录每一行。这里也会对目录层级进行判断从而缩进，方法与前面介绍的一样
              章节名称存在时才渲染此项目录。-->
              <div class="book-detail-content-navigation-text"
                   :class="{'is-sub': item.deep > 1}"
                   :style="itemStyle(item)"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--图书详细信息包裹层，第三个是试读部分-->
      <div class="book-detail-content-wrapper">
        <div class="book-detai-l-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-listwrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <!--预览部分-->
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <!--立即阅读部分-->
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import DetailTitle from '../../components/detail/DetaiTitle'
  import BookInfo from '../../components/detail/BookInfo'
  import Scroll from '../../components/common/Scroll'
  import Toast from '../../components/common/Toast'
  import { detail } from '../../api/store'
  import { px2rem, realPx } from '../../utils/utils'
  import Epub from 'epubjs'

  global.ePub = Epub;

  export default {
    components: {
      DetailTitle,
      Scroll,
      BookInfo,
      Toast
    },
    computed: {
      // 获取电子书简要介绍
      desc () {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      // 获取电子书目录
      flatNavigation () {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      // 选择语言种类
      lang () {
        return this.metadata ? this.metadata.language : '-'
      },
      // 获取电子书ISBN
      isbn () {
        return this.metadata ? this.metadata.identifier : '-'
      },
      // 获取电子书出版社
      publisher () {
        return this.metadata ? this.metadata.publisher : '-'
      },
      title () {
        return this.metadata ? this.metadata.title : ''
      },
      author () {
        return this.metadata ? this.metadata.creator : ''
      }
    },
    data () {
      return {
        bookItem: null,
        book: null,
        metadata: null, // 电子书标题作者等信息
        trialRead: null,
        cover: null, // 电子书封面
        navigation: null, // 存储电子书的目录
        displayed: false, // 判断电子书是否渲染完毕
        audio: null,
        randomLocation: null,
        description: null, // 电子书简要介绍数据
        toastText: '',
        trialText: null,
        categoryText: null,
        opf: null // 电子书content.opf文件路径
      }
    },
    methods: {
      addOrRemoveShelf () {
      },
      showToast (text) {
        this.toastText = text;
        this.$refs.toast.show()
      },
      readBook () {
        this.$router.push({
          path: `/ebook/${this.categoryText}|${this.fileName}`
        })
      },
      trialListening () {
      },
      // 阅读电子书
      read (item) {
        this.$router.push({
          path: `/ebook/${this.categoryText}|${this.fileName}`
        })
      },
      // 子级目录缩进
      itemStyle (item) {
        return {
          marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
        }
      },
      // 给目录加上层级并拍平
      doFlatNavigation (content, deep = 1) {
        const arr = [];
        content.forEach(item => {
          item.deep = deep;
          arr.push(item);
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        });
        return arr
      },
      downloadBook () {
        const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`;
        this.parseBook(opf)
      },
      // 根据路径将电子书解析为对象，loaded为钩子函数.参数为opf路径。
      // 当传入整本电子书的路径时，epub解析的第一步也是找到content.opf文件，它包含了整本电子书的资源文件。
      // 这样做的好处是预览时避免了下载整本电子书，也能获取相关资源
      parseBook (url) {
        this.book = new Epub(url);
        // 获取电子书的标题作者等信息
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        });
        // 获取电子书的目录信息
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav;
          if (this.navigation.toc && this.navigation.toc.length > 1) {
            // 把第二章节(也就是去除了封面章节的第一个章节)的地址传入渲染函数，返回Promise对象方便我们操作
            const candisplay = this.display(this.navigation.toc[1].href);
            if (candisplay) {
              candisplay.then(section => {
                // 渲染那一页后，display会返回一个该章节信息的对象。
                if (this.$refs.scroll) {
                  this.$refs.scroll.refresh()
                }
                this.displayed = true;
                // 打印section对象
                const reg = new RegExp('<.+?>', 'g');
                const text = section.output.replace(reg, '').replace(/\s\s/g, '');
                this.description = text
              })
            }
          }
        })
      },
      // 详情页面加载完毕后立即调用初始化函数
      init () {
        this.fileName = this.$route.query.fileName;
        this.categoryText = this.$route.query.category;
        if (this.fileName) {
          detail({
            fileName: this.fileName
          }).then(response => {
            if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
              const data = response.data.data;
              this.bookItem = data;
              this.cover = this.bookItem.cover;
              let rootFile = data.rootFile;
              if (rootFile.startsWith('/')) {
                rootFile = rootFile.substring(1, rootFile.length)
              }
              // 获取电子书的content.opf文件路径，传入解析电子书的函数内
              this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`;
              this.parseBook(this.opf)
            } else {
              this.showToast(response.data.msg)
            }
          })
        }
      },
      // 返回上一条历史记录
      back () {
        this.$router.go(-1)
      },
      // 渲染函数。判断DOM是否存在以及渲染对象是否生成，没有的话则生成渲染对象，并挂载到DOM上
      display (location) {
        if (this.$refs.preview) {
          if (!this.rendition) {
            this.rendition = this.book.renderTo('preview', {
              width: window.innerWidth > 640 ? 640 : window.innerWidth,
              height: window.innerHeight,
              method: 'default'
            })
          }
          // 如果传入了位置，则渲染扉页。
          if (!location) {
            return this.rendition.display()
          } else {
            return this.rendition.display(location)
          }
        }
      },
      onScroll (offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-detail {
    width: 100%;
    background: white;
    .content-wrapper {
      width: 100%;
      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;
        .book-detail-content-title {
          font-size: px2rem(20);
          font-weight: bold;
          padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
          box-sizing: border-box;
        }
        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          box-sizing: border-box;
          .loading-text-wrapper {
            width: 100%;
            .loading-text {
              font-size: px2rem(14);
              color: #666;
            }
          }
          .book-detail-content-row {
            display: flex;
            box-sizing: border-box;
            margin-bottom: px2rem(10);
            .book-detail-content-label {
              flex: 0 0 px2rem(70);
              font-size: px2rem(14);
              color: #666;
            }
            .book-detail-content-text {
              flex: 1;
              font-size: px2rem(14);
              color: #333;
            }
          }
          #preview {
          }
          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #666;
              border-bottom: px2rem(1) solid #eee;
              &:last-child {
                border-bottom: none;
              }
              .book-detail-content-navigation-text {
                width: 100%;
                @include nowrap;
                &.is-sub {
                  color: #666;
                }
              }
            }
          }
        }
      }
      .audio-wrapper {
        width: 100%;
        padding: px2rem(15);
        box-sizing: border-box;
        #audio {
          width: 100%;
        }
      }
    }
    .bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 120;
      display: flex;
      width: 100%;
      height: px2rem(52);
      box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);
      .bottom-btn {
        flex: 1;
        color: $color-blue;
        font-weight: bold;
        font-size: px2rem(14);
        @include center;
        &:active {
          color: $color-blue-transparent;
        }
        .icon-check {
          margin-right: px2rem(5);
        }
      }
      &.hide-shadow {
        box-shadow: none;
      }
    }
  }
</style>
