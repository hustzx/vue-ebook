const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // -1表示设置面板不显示，0表示显示字号面板，1表示显示主题面板
    defaultFontSize: 16,
    currentBook: null,
    defaultFontFamily: 'Default', // 字体默认样式
    fontFamilyVisible: false, // 字体样式面板是否弹出
    defaultTheme: 'default', // 设置主题样式
    bookAvailable: false, // 设置电子书加载是否完成
    progress: 0, // 阅读进度
    section: 0, // 电子书当前章节,0表示第一个章节
    cover: null, // 电子书封面
    metadata: null, // 电子书作者标题等信息
    navigation: null, // 电子书目录对象
    offsetY: 0, // 手势下拉距离
    isBookmark: false, // 当前页面是否是书签页
    bookmarkList: [] // 电子书的书签列表
  },
  mutations: {
    SET_FILENAME: (state, fileName) => {
      state.fileName = fileName
    },
    SET_MENUVISIBLE: (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    SET_SETTINGVISIBLE: (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    SET_DEFAULTFONTSIZE: (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    SET_CURRENTBOOK: (state, currentBook) => {
      state.currentBook = currentBook
    },
    SET_DEFAULTFONTFAMILY: (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    SET_FONTFAMILYVISIBLE: (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    SET_DEFAULTHEME: (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },
    SET_BOOKAVAILABLE: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    },
    SET_SECTION: (state, section) => {
      state.section = section
    },
    SET_COVER: (state, cover) => {
      state.cover = cover
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY
    },
    SET_IS_BOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    SET_BOOKMARKLIST: (state, bookmarkList) => {
      state.bookmarkList = bookmarkList
    }
  }
};
export default book
