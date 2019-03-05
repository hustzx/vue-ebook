# vue-imooc-ebook

## 项目概述
  
　　这个项目实现了书城首页、电子书详情页、电子书阅读界面的跳转。主要的技术栈是vue+vuex+vue-router;vue-i18n实现
国际化;vue-transition实现一些元素过度动画;sass编写样式;大部分布局采用flex弹性布局;nodejs做路由匹配，向前台发送
数据;MySql存储了电子书的相关信息;所有的静态资源都放入了nginx服务器中;最后购买了阿里云的服务器，但由于学生党没钱，
只买了带宽1M的服务器，所以网页加载速度很慢，特别是阅读界面先下载电子书时需要几十秒才能展示电子书内容。
   
## 书城首页

　　书城首页最上方含有中英文切换与一个随机推荐的效果。内容是先弹出一个烟花绽放的动画，再弹出随机推荐的对话框，点击
立即阅读即可进入详情页面。在搜索框中输入字符即可显示书名中包含该字符的所有图书，至于下面的搜索记录与热门搜索纯粹是
我自己在组件中写死了数据，并没有与后台进行交互。
　　下面的猜你喜欢与热门推荐的数据也不是真实的，实际上我就是在
