import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    {
      path: '/ebook',
      // import()类似于import指令，但前者更加灵活，能够实现异步动态加载，写在代码块中,比如if语句和函数中
      // import指令是编译时加载，先于其他部分解析，require指令是运行时加载，故可以动态加载，但是同步加载。
      // import()返回的是一个Promise对象
      component: () => import('./views/ebook/index.vue'),
      children: [{
          path: ':fileName', // 通过:参数值传值,fileName有点类似形参,存储实际的值
          component: () => import('./components/ebook/EbookReader.vue')
        }
      ]
    },
    {
      path: '/store',
      component: () => import('./views/store/index.vue'),
      redirect: '/store/home',
      children: [{
        path: 'home', // 加上/代表绝对路径
        component: () => import('./views/store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('./views/store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('./views/store/StoreDetail.vue')
      }]
    }
  ]
})
