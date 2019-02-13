 // localstorage是H5新特性,存储空间有5M，而Cookie只有4K
 import Storage from 'web-storage-cache'

 const localStorage = new Storage();
// 向localStorage里面添加缓存
export function setLocalStorage (key, value) {
  return localStorage.set(key, value)
}
 // 获取缓存
 export function getLocalStorage (key) {
   return localStorage.get(key)
 }
 // 删除缓存
 export function removeLocalStorage (key) {
   return localStorage.delete(key)
 }
 // 清空缓存
 export function clearLocalStorage () {
   return localStorage.clear()
 }
 // 电子书
 export function setBookObject (fileName, key, value) {
  // 针对每本书都要有不同的配置,因为它们的字体设置或者进度等不一定相同。先从缓存池中取出这本书这个对象
  // 然后为这个对象添加一些缓存信息。其实就是每本书以对象的形式存储，值也为一个对象，这个对象存储着相关信息
  let book = getLocalStorage(`${fileName}-info`);
  if (!book) {
    book = {}
  }
  book[key] = value;
  setLocalStorage(`${fileName}-info`, book)
 }
 export function getBookObject (fileName, key) {
   let book = getLocalStorage(`${fileName}-info`);
   if (book) {
     return book[key]
   } else {
     return null
   }
 }
 // 保存字体样式
 export function getFontFamily (fileName) {
  return getBookObject(fileName, 'fontFamily')
 }
 export function saveFontFamily (fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
 }
 // 保存字体大小
 export function getFontSize (fileName) {
   return getBookObject(fileName, 'fontSize')
 }
 export function saveFontSize (fileName, fontSize) {
   setBookObject(fileName, 'fontSize', fontSize)
 }
 // 保存全局语言设置
 export function getLocale () {
   return getLocalStorage('locale')
 }
 export function saveLocale (locale) {
   return setLocalStorage('locale', locale)
 }
 // 保存主题设置
 export function getTheme (fileName) {
   return getBookObject(fileName, 'theme')
 }
 export function saveTheme (fileName, theme) {
   setBookObject(fileName, 'theme', theme)
 }
 // 保存章节信息
 export function getLocation (fileName) {
   return getBookObject(fileName, 'location')
 }
 export function saveLocation (fileName, location) {
   setBookObject(fileName, 'location', location)
 }
  // 保存书签列表
 export function getBookmark (fileName) {
   return getBookObject(fileName, 'bookmark')
 }
 export function saveBookmark (fileName, bookmark) {
   setBookObject(fileName, 'bookmark', bookmark)
 }
