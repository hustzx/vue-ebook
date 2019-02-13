const store = {
  state: {
    hotSearchOffsetY: 0, // 热门搜索的滚动距离
    flapCardVisible: false, // 控制翻转卡片显示
    locale: 'cn' // 中英文切换
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, y) {
      state.hotSearchOffsetY = y
    },
    SET_FLAP_CARD_VISIBLE (state, visible) {
      state.flapCardVisible = visible
    },
    SET_LOCALE (state, locale) {
      state.locale = locale
    }
  }
};
export default store
