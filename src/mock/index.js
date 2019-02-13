import Mock from 'mockjs'
import home from './bookHome'
import shelf from './bookShelf'
import list from './bookList'
import flatList from './bookFlatList'

 // 第一个参数是请求的路径，第二个参数是ajax请求的类型，第三个参数是获取的数据模板或数据，也就是模拟的响应数据
 // mock会拦截真实的ajax请求
Mock.mock(/\/book\/home/, 'get', home);
Mock.mock(/\/book\/shelf/, 'get', shelf);
Mock.mock(/\/book\/list/, 'get', list);
Mock.mock(/\/book\/flat-list/, 'get', flatList);
