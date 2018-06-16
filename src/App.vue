<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
body {
  min-height:100%;
  margin:0;
  padding:0;
  position:relative;
  background-color: #fff;
}

html {
  height:100%;
}

* {
  margin:0;
  padding:0;
}

ul {
  list-style: none;
}

.popup {
  width: 100%;
  opacity: .8;
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 375px;
}

.mu-scale-transition-enter-active,
.mu-scale-transition-leave-active {
  transition: transform .45s cubic-bezier(0.23, 1, 0.32, 1), opacity .45s cubic-bezier(0.23, 1, 0.32, 1);
  backface-visibility: hidden;
}

.mu-scale-transition-enter,
.mu-scale-transition-leave-active {
  transform: scale(0);
  opacity: 0;
}

.mu-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.selected.mu-item-wrapper .mu-item {
  color: #ff4081;
}

@media screen and (max-width: 768px) {
  .mu-desc {
    max-width: 100% !important;
    flex-direction: column;
    justify-content: flex-start !important;
  }

  .mu-desc-image + .mu-desc-content,
  .mu-desc-content + .mu-desc-image {
    margin-left: 0px !important;
    margin-top: 20px;
  }

  .mu-desc-title {
    font-size: 32px !important;
  }

  .mu-desc-sub-title {
    font-size: 21px !important;
  }
}
</style>
