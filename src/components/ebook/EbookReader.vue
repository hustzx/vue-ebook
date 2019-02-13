  <!--EbookReader组件作用是解析渲染电子书-->
<template>
    <div class="ebook-reader">
      <div id="read"></div>
      <!--touchmove是移动端按下后移动才有效，但mousemove鼠标移动事件没有这个限制。所以这里PC端必须鼠标按住后才能让mousemove生效-->
      <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"
      @mousedown.left="onMouseEnter" @mousemove.left="onMouseMove" @mouseup.left="onMouseEnd"></div>
    </div>
</template>

<script>
  import Epub from 'epubjs'
  import { ebookMixin } from '../../utils/mixin'
  import { getFontFamily, saveFontFamily,
    getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localStorage'
  // import { addCss } from '../../utils/book' // 一定要将css文件在epunjs后面引入才有效
  import { flatten } from '../../utils/book'
  global.ePub = Epub;
  export default {
    mixins: [ebookMixin],
    methods: {
      // 先判断鼠标是否已经点击，只有鼠标点击后的移动事件我们才进行处理，也就是获取点击时的鼠标坐标
      // 鼠标松手后，也即mouseup事件触发后的鼠标移动事件也不进行处理。注意，鼠标松手后也会触发click事件，但按下不会触法click事件
      onMouseEnter (e) {
        this.mouseState = 1;
        this.mouseStartTime = e.timeStamp;
        e.preventDefault();
        e.stopPropagation()
      },
      onMouseMove (e) {
        if (this.mouseState === 1) {
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          let offsetY = 0;
          if (this.firstOffsetY) {
            offsetY = e.clientY - this.firstOffsetY;
            this.setOffsetY(offsetY)
          } else {
            this.firstOffsetY = e.clientY // 刚刚触摸屏幕时的手指距离
          }
        }
        e.preventDefault();
        e.stopPropagation()
      },
      onMouseEnd (e) {
        if (this.mouseState === 2) {
          this.setOffsetY(0);
          this.firstOffsetY = null;
          this.mouseState = 3 // 这里不改变状态值的话，mouseState会为2，从而导致移动事件一直被执行
        } else {
          this.mouseState = 4;// 只要按下鼠标就会触发down事件，状态为1。如果下拉的话就需要鼠标移动，进入状态2,弹起后进入状态3.如果不移动
          // 或者手抖移动时间很短，弹起后就会进入状态4，视作一次单纯的click事件，触发onMaskClick事件.keyup事件总是在click事件之前执行
          this.setOffsetY(0)
        }
        const time = e.timeStamp - this.mouseStartTime;
        if (time < 100) {
          this.mouseState = 4;
        }
        e.preventDefault();
        e.stopPropagation()
      },
      onMaskClick (e) {
        // 由于down事件与点击事件的冲突，这里要做一个判断
        if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
          return
        }
        const offsetX = e.offsetX;
        if (offsetX > 0 && offsetX < window.innerWidth * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > window.innerWidth * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      move (e) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY // 刚刚触摸屏幕时的手指距离
        }
        e.preventDefault(); // 不然下拉会出现问题
        e.stopPropagation();
      },
      moveEnd () {
        this.setOffsetY(0);
        this.firstOffsetY = null
      },
      initFontFamily () {
        let font = getFontFamily(this.fileName);
        // 如果获取字体时发现缓存中并未写入字体样式，那么就将默认样式存入缓存
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.setDefaultFontFamily(font);
          this.rendition.themes.font(font)
        }
      },
      initFontSize () {
        let fontSize = getFontSize(this.fileName);
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.setDefaultFontSize(fontSize);
          this.rendition.themes.fontSize(fontSize)
        }
      },
      initTheme () {
        let dTheme = getTheme(this.fileName);
        if (!dTheme) {
          this.setDefaultTheme(this.themeList[0].name);
          saveTheme(this.fileName, this.themeList[0].name)
        } else {
          this.setDefaultTheme(dTheme)
        }
        // 这里使用箭头函数的原因是保持this指向的一致性。传统函数中，this已经指向了调用foreach方法的
        // themeList对象，而不是这个vue实例。解决的办法是在foreach外围再设一个变量保存this指向
        // 如 var _this = this 先注册样式
        this.themeList.forEach(theme => {
          // 第一个参数为注册主题的名字，第二个为具体样式
          this.rendition.themes.register(theme.name, theme.style)
        });
        this.rendition.themes.select(this.defaultTheme)
      },
      initRendition () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default' // 兼容微信
        });
        const location = getLocation(this.fileName);
        this.display(location, () => {
          this.initTheme();
          this.initFontFamily();
          this.initFontSize();
          this.initGlobalStyle()
        });
        // 调用钩子函数给iframe添加样式文件
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            // 阅读epibjs源码即可知道addStyleSheet方法传入的是一个url。这里设置一个环境变量存储静态资源路径
            // 环境变量与基本配置必须重启项目才能生效。因为在项目的启动时会一次性注入
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
        })
      },
      initGesture () {
        // 利用rendition对象的on方法为iframe绑定事件，此处绑定手势事件，利用滑动实现翻页
        this.rendition.on('touchstart', event => {
          // 每次触摸会生成changeTouches对象，一个手触摸的话数组里只有一个对象，否则两个。存储触摸开始时手指的位置
          this.touchStartX = event.changedTouches[0].clientX;
          this.touchStartTime = event.timeStamp;
        });
        this.rendition.on('touchend', event => {
          // 计算触摸开始结束发生的时间差与横坐标差来判断左移还是右移，并让长时间触摸无效
          const offsetX = event.changedTouches[0].clientX - this.touchStartX;
          const time = event.timeStamp - this.touchStartTime;
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          event.stopPropagation();
          event.preventDefault()
        })
      }, // 初始化手势触摸事件
      // 获取电子书相关信息
      parseBook () {
        this.book.loaded.cover.then(cover => { // cover为封面信息
          this.book.archive.createUrl(cover).then(url => { // 生成封面链接
            this.setCover(url);
          })
        });
        this.book.loaded.metadata.then(metadata => { // metadata为标题作者等信息
          this.setMetadata(metadata)
        });
        this.book.loaded.navigation.then(nav => { // nav对象存储目录信息。length属性为所有级别目录数目，toc为数组，存储一级目录
          // toc下有subitems属性存储子级目录
           const navItem = flatten(nav.toc);
           // 定义查找每一目录对象的级数。0为一级目录。先判断父目录是否存在，若不存在直接返回0，存在则对父元素调用此方法
          // 注意item中parent属性只是一个id号，并不是父目录对象本身,所以我们要根据这个id号找出父目录对象
          function find (item, level = 0) {
            if (!item.parent) {
              return level
            } else {
              return find(navItem.filter(function (parentItem) {
                return parentItem.id === item.parent
              })[0], ++level)
            }
          }
          navItem.forEach(item => {
            // 给每一个目录对象添加一个级别属性
            item.level = find(item)
          });
          this.setNavigation(navItem)
        })
      },
      initEpub () {
        // const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName; // 动态路由
        // const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`;
        const url = `${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`;
        this.book = new Epub(url);
        this.setCurrentBook(this.book);
        this.initRendition();
        this.initGesture();
        this.parseBook();
        // 调用ready钩子函数，电子书解析完毕后调用
        this.book.ready.then(() => {
          // 调用分页方法，参数为一页包含的文字数，这里先进行粗糙分页
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          this.refreshLocation(); // 在refresh函数里，通过locations对象来更新progress，所以必须等待locations对象分页完毕后才有效
          // 这也就导致了刷新页面时获取不到进度
          this.setBookAvailable(true)
        })
      },
      prevPage () {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
        }
        this.hideTitleAndMenu()
      },
      nextPage () {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
        }
        this.hideTitleAndMenu()
      },
      toggleTitleAndMenu () {
        // 当切换菜单栏时，若菜单栏重新出现则要将设置面板隐藏
        if (this.menuVisible) {
          this.setSettingVisible(-1);
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      }
    },
    mounted () {
      // 这里传过来的fileName是文件夹/电子书名两个变量汇总成一个变量，中间任选取一个不是路径特殊字符的字符作为分隔符即可
      // 实际写法是path:'/epub/:type/:fileName'。这里也可以用ES6的字符串拼接新语法来写`${变量名}`
      const fileName = this.$route.params.fileName.split('|').join('/');// 将路径地址拼接，通过$route.params找到形参
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .ebook-reader{
    width:100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask{
      position: absolute;
      left:0;
      top:0;
      // z-index: 200;
      z-index: 160;
      background: transparent;
      width:100%;
      height:100%;
    }
  }
</style>
