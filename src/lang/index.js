 // 存储语言设置
import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage';

Vue.use(VueI18N);

let locale = getLocale(); // 设置默认语言
if (!locale) {
  locale = 'cn';
  saveLocale(locale);
}
  // 这里必须是messages,提供可选择的语言
const messages = {
  en,
  cn
};
const i18n = new VueI18N({
 locale,
 messages
});
export default i18n
