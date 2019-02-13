import axios from 'axios'

 export function home () {
  return axios({
    method: 'get',
    // 网页基础路径
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
 }
  // book为形参，是一个对象.axios请求是向后端请求数据
 export function detail (book) {
  return axios({
    method: 'get',
    // 电子书线上数据
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
 }
export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}
