 <!--书城页面入口组件-->
<template>
  <div class="store">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global";
  .store{
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
