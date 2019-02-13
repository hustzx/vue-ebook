// function mock(app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
//
// const homeData = require('./src/mock/bookHome');
// const shelfData = require('./src/mock/bookShelf');
// const listData = require('./src/mock/bookList');
// const flatListData = require('./src/mock/bookFlatList');
module.exports = {
  // 根据模式的不同设置打包路径的不同。生产环境下进入当前目录下，开发模式进入根目录
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  // devServer: {
  //   before(app){
  //     mock(app, `/book/home`, homeData);
  //     mock(app, '/book/shelf', shelfData);
  //     mock(app, '/book/list', listData);
  //     mock(app, '/book/flat-list', flatListData);
  //   }
  // },
  // 配置webpack
  configureWebpack: {
    // 配置性能
    performance: {
      hints: 'warning', // 以警告形式展示错误信息
      maxAssetSize: 512 * 1024,
      maxEntrypointSize: 512 * 1024
    }
  }
};
