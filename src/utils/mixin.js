import { mapGetters, mapActions } from 'vuex' // 这里两者写在一起，不然会报重复引用的错误
import { themeList, addCss } from './book'
import { saveLocation, getBookmark } from './localStorage'
import { getCategoryName } from './store'

export const ebookMixin = {
  computed: {
    ...mapGetters(['fileName', 'menuVisible', 'settingVisible', 'defaultFontSize', 'currentBook', 'defaultFontFamily',
    'fontFamilyVisible', 'defaultTheme', 'bookAvailable', 'progress', 'section', 'cover', 'metadata', 'navigation',
    'offsetY', 'isBookmark', 'bookmarkList']),
    themeList () {
      return themeList(this) // 避免每次重复调用this，优化性能
    },
    getSectionName () {
//        if (this.section) {
//          const sectionInfo = this.currentBook.section(this.section); // 获取当前章节信息，即章节地址
//          if (sectionInfo && sectionInfo.href) {
//             return this.currentBook.navigation.get(sectionInfo.href).label// 在目录对象里存储了各个章节的名称
//          }
//        }
//        return ''
//      }
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions(['setFileName', 'setMenuVisible', 'setSettingVisible', 'setDefaultFontSize', 'setCurrentBook',
    'setDefaultFontFamily', 'setFontFamilyVisible', 'setDefaultTheme', 'setBookAvailable', 'setProgress', 'setSection',
    'setCover', 'setMetadata', 'setNavigation', 'setOffsetY', 'setIsBookmark', 'setBookmarkList']),
    // 初始化全局样式.思考是否可以通过字符串拼接来动态添加theme_${defaultTheme}
    initGlobalStyle () {
      switch (this.defaultTheme) {
        case 'default' :
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
        case 'eye' :
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break;
        case 'night' :
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break;
        case 'gold' :
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break;
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
      }
    },
    // 更新进度信息.rendition对象存储了关于当前页面的大量信息，比如当前页面所在章节，以及该章节有多少页、
    // 当前页数在我们分页中处于哪一页等信息，这个函数还更新了进度缓存了当前页面首字符
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation();
      // 获取当前页面所在进度百分比，这个值精准.猜测start与end分别代表当前页面第一个字符与最后一个字符的信息。
      const startCfi = currentLocation.start.cfi;
      const progress = this.currentBook.locations.percentageFromCfi(startCfi);
      this.setProgress(Math.floor(progress * 100));
      this.setSection(currentLocation.start.index);
      saveLocation(this.fileName, startCfi);
      const bookmark = getBookmark(this.fileName);
      if (bookmark) {
        // some为ES6新语法，遍历数组中每一项，只要任一项满足条件则返回真
        if (bookmark.some(item => item.cfi === startCfi)) {
          this.setIsBookmark(true)
        } else {
          this.setIsBookmark(false)
        }
      } else {
        this.setIsBookmark(false)
      }
    },
    // 抽象出另一个display方法，不用每次都要写this.currentBook.rendition
    display (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) {
            cb()
          }
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) {
            cb()
          }
        })
      }
    },
    hideTitleAndMenu () {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false)
    }
  }
};
export const storeHomeMixin = {
  computed: {
    ...mapGetters(['offsetY', 'hotSearchOffsetY', 'flapCardVisible', 'locale'])
  },
  methods: {
    ...mapActions(['setOffsetY', 'setHotSearchOffsetY', 'setFlapCardVisible', 'setLocale']),
    // 去书的详情页
    showBookDetail (book) {
      this.$router.push({
        path: '/store/detail',
        query: {
          fileName: book.fileName,
          // category: book.categoryText
          category: getCategoryName(book.category)
        }
      })
    }
  }
};
