<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {}
  document.addEventListener('DOMContentLoaded', () => {
    // 自适应布局基础，设定了1rem的值
    const html = document.querySelector('html');
    let fontSize = window.innerWidth / 10;
    fontSize = fontSize > 50 ? 50 : fontSize;
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style lang="scss" scoped>
  #app{
    width:100%;
    height: 100%;
    overflow: hidden;
    background: #7d8188;
  }
</style>
