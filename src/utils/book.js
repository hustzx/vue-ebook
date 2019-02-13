import { realPx } from './utils'

// 这里存储组件的静态变量
 export const FONT_SIZE_LIST = [
   { fontSize: 12 },
   { fontSize: 14 },
   { fontSize: 16 },
   { fontSize: 18 },
   { fontSize: 20 },
   { fontSize: 22 },
   { fontSize: 24 }
 ];
export const FONT_FAMILY_LIST = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
];
 // 引入vue实例是因为适应国际化
export function themeList (vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(48)}px !important`,
          'padding-bottom': `${realPx(48)}px !important`
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(48)}px !important`,
          'padding-bottom': `${realPx(48)}px !important`
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000',
          'padding-top': `${realPx(48)}px !important`,
          'padding-bottom': `${realPx(48)}px !important`
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(48)}px !important`,
          'padding-bottom': `${realPx(48)}px !important`
        }
      }
    }
  ]
}
 // 在head标签下添加css文件，设置整屏背景
export function addCss (href) {
  removeAllCss();
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  document.getElementsByTagName('head')[0].appendChild(link)
}
 // 增加css后，需要清除先前添加的css文件
 export function removeCss (href) {
   const links = document.getElementsByTagName('link');
   for (let i = links.length; i >= 0; i--) {
     if (links[i] && links[i].href === href) {
       links[i].parentNode.removeChild(links[i])
     }
   }
 }
 export function removeAllCss () {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
 }
  // 数组降维,可以将树状数组转化为一维数组。核心思想有两点：一是数组里面元素可以被...运算符解构。例如...[1,2]可以被拆开成1,2
  // 二是concat方法可以将传入的参数与调用者重新合并成一个数组
 export function flatten (array) {
  return [].concat(...array.map(function (item) {
    // 将数组中的每一项item都返回一个数组.如果那一项存在子数组，则子数组中的每一项也会被解构出来与父数组合并成为一个返回的新数组。这样
    // 再将每一项返回的新数组解构合并成一个总数组
    return [].concat(item, ...flatten(item.subitems))
  }))
 }
