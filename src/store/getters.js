const book = {
  fileName: state => {
    return state.book.fileName
  },
  menuVisible: state => {
    return state.book.menuVisible
  },
  settingVisible: state => {
    return state.book.settingVisible
  },
  defaultFontSize: state => {
    return state.book.defaultFontSize
  },
  currentBook: state => {
    return state.book.currentBook
  },
  defaultFontFamily: state => {
    return state.book.defaultFontFamily
  },
  fontFamilyVisible: state => {
    return state.book.fontFamilyVisible
  },
  defaultTheme: state => {
    return state.book.defaultTheme
  },
  bookAvailable: state => {
    return state.book.bookAvailable
  },
  progress: state => {
    return state.book.progress
  },
  section: state => state.book.section,
  cover: state => state.book.cover,
  metadata: state => state.book.metadata,
  navigation: state => state.book.navigation,
  offsetY: state => state.book.offsetY,
  isBookmark: state => state.book.isBookmark,
  bookmarkList: state => state.book.bookmarkList,
  hotSearchOffsetY: state => state.store.hotSearchOffsetY,
  flapCardVisible: state => state.store.flapCardVisible,
  locale: state => state.store.locale
};
export default book;
