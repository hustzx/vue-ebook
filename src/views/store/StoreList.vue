 <!--此组件是图书列表组件/store/list-->
<template>
  <div class="book-list-wrapper">
    <detail-title :title="title" :showShelf="true" @back="back" ref="title"></detail-title>
    <scroll class="book-list-scroll-wrapper" :top="42" @onScroll="onScroll" ref="scroll">
      <!--list是对象而不是数组，里面的属性值为数组-->
      <featured :data="value" :titleText="titleText ? titleText : getCategoryText(key)" :btnText="''" v-for="(value, key, index) in list"
                :key="index"></featured>
    </scroll>
  </div>
</template>

<script>
  import DetailTitle from '../../components/detail/DetaiTitle'
  import Scroll from '../../components/common/Scroll'
  import Featured from '../../components/home/Featured'
  import { realPx } from '../../utils/utils'
  import { list } from '../../api/store'
  import { categoryList, categoryText } from '../../utils/store'

  export default {
    components: {
      DetailTitle,
      Scroll,
      Featured
    },
    computed: {
      title () {
        if (this.list) {
          return this.total && this.$t('home.allBook').replace('$1', this.totalNumber)
        } else {
          return null
        }
      },
      // 计算搜索结果数目
      totalNumber () {
        let num = 0;
        Object.keys(this.list).forEach(key => {
          num += this.list[key].length
        });
        return num
      }
    },
    data () {
      return {
        list: null,
        total: null
      }
    },
    methods: {
      // 获取分类名称的国际化与里面符合条件的书数目
      getCategoryText (key) {
        return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
      },
      // 返回上一级
      back () {
        this.$router.go(-1)
      },
      onScroll (offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      // 获取符合条件的列表
      getList () {
        list().then(response => {
          this.list = response.data.data; // 首先获取图书列表所有数据
          this.total = response.data.total;
          const category = this.$route.query.category;
          const keyword = this.$route.query.keyword;
          if (category) {
            // Object.keys方法遍历对象，最终返回一个由属性名组成的数组
            // const key = Object.keys(this.list).filter(item => item === category)[0];
            // const data = this.list[key]; // 获取图书列表中对应分类的数据数组
            const data = this.list[category];
            this.list = {};
            // this.list[key] = data // 重新设置list值，让它变成只含有对应分类的数据
            this.list[category] = data
          } else if (keyword) {
            Object.keys(this.list).filter(key => { // 这里的key是原始list数组中的每一个分类名称,每一个分类名称就是list对象的属性
              // 每一个分类名称的值都是包含所有图书数据的数组，对每一个分类数组进行过滤操作，保留图书名称中含有关键词的图书数据，
              // 赋给list对象中对应的分类数组，这样list对象中每个分类数组中只含有符合条件的图书信息对象。
              // filter返回的是一个新数组，不会改动原数组
              this.list[key] = this.list[key].filter(book => book.fileName.indexOf(keyword) >= 0);
              return this.list[key].length > 0
            })
          }
        })
      }
    },
    created () {
      this.getList();
      this.titleText = this.$route.query.categoryText
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .book-list-wrapper {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
