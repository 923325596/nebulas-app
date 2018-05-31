<template>
  <div>
    <div class="mu-banner">
      <img src="../../assets/bg.png" alt="" class="mu-banner-image">
      <div class="mu-logo">
        <img src="../../assets/pen.png" alt="" class="mu-logo-image">
      </div>
      <h1 class="mu-banner-title">
        星云故事接龙
      </h1>
      <div class="mu-banner-actions">
        <mu-button raised to="/story/list" class="mu-banner-button">Start</mu-button>
        <mu-button raised to="https://github.com/YanYuanFE/nebulas-app" class="mu-banner-button">
          GITHUB
          <mu-icon right value=":mudocs-icon-custom-github"></mu-icon>
        </mu-button>
      </div>
    </div>
    <div class="mu-desc-wrapper">
      <div class="mu-desc">
        <img src="../../assets/img2.png" class="mu-desc-image" />
        <div class="mu-desc-content">
          <h2 class="mu-desc-title">基于星云链</h2>
          <h3 class="mu-desc-sub-title">集合多人创作灵感</h3>
          <div class="mu-desc-text">
            公开透明
          </div>
        </div>
      </div>
    </div>
    <div class="mu-footer">
      Powered By Nebulas<br/>
      由星云链驱动
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="less">
@import "../../styles/vars.less";

.mu-banner{
  z-index: 100;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.mu-banner-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
.mu-logo{
  width: 120px;
  height: 120px;
  line-height: 100px;
  text-align: center;
  background-color: @alternateTextColor;
  margin:  0 auto;
  color: @primaryColor;
  font-size: 50px;
  border-radius: 50%;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mu-logo-image {
  width: 70%;
  height: 70%;
}
.mu-banner-title{
  display: block;
  font-size: 48px;
  line-height: 1;
  font-weight: 300;
  color: fade(@alternateTextColor, 87%);
  margin-top: 0;
  margin-bottom: 12px;
  text-align: center;
}

.mu-banner-button{
  color: @primaryColor;
}

.mu-banner-actions{
  text-align: center;
  font-size: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .mu-raised-button {
    font-size: 15px;
    margin-left: 12px;
  }
}

.mu-desc-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mu-desc {
  max-width: 972px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 500px;
}
.mu-desc-image + .mu-desc-content,
.mu-desc-content + .mu-desc-image {
  margin-left: 120px;
}

.mu-desc-title{
  font-size: 64px;
  font-weight: 300;
  color: #726b79;
  margin: 0;
}
.mu-desc-sub-title {
  font-size: 36px;
  font-weight: 300;
  color: #8d70aa;
  margin: 0;
}
.mu-desc-image {
  width: 400px;
}

.mu-desc-text {
  font-size: 18px;
  color: #736f76;
  font-weight: 300;
}

.mu-footer{
  background-color: #1b1b1b;
  text-align: center;
  color: #777777;
  padding: 50px 40px;
}

</style>
