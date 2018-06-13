<template>
  <mu-container>
    <mu-button raised color="primary" to="/story/list">返回</mu-button>
    <mu-card-text>
      <ul>
        1. 需要提前准备什么？
        <li>
          <p>
          为正常使用网站提供的功能，请使用Chrome浏览器或者手机浏览器，并且安装插件 WebExtensionWallet或者NAS nano官方钱包APP。
          WebExtensionWallet chrome插件 和 NAS nano APP是星云链官方指定的钱包，通过它可以方便我们转账、调用智能合约。
          </p>
          <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">下载插件</a><br/>
          <a href="https://mp.weixin.qq.com/s/XyWuc3ahCBNdvaPyw7OG4A">NAS nano APP钱包下载</a>
        </li>
      </ul>
    </mu-card-text>
    <mu-divider></mu-divider>
    <mu-card-text>
      <ul>
        2. 基本使用方法是什么？
        <li>
          <p>
            进入<router-link to="/story/list">主页</router-link>，可以看到书写故事的表单和所有故事列表，你可以通过输入提交自己的故事，然后由别人来接龙，
            你添加的故事会出现在故事列表，点击列表的故事可以进入故事的详情，可以看到故事的作者和其他人续写的故事，你也可以参加到续写故事中来。
          </p>
        </li>
      </ul>
    </mu-card-text>
    <mu-divider></mu-divider>
    <mu-card-text>
      <ul>
        3. 使用需要消耗NAS吗？
        <li>
          <p>
            对于提交故事和续写故事操作需要消耗极少量的手续费Gas。
          </p>
        </li>
      </ul>
    </mu-card-text>
    <mu-divider></mu-divider>
    <mu-card-text>
      <h2>
        联系作者
      </h2>
      <p>
        Email： yan950414@gmail.com
      </p>
      <p>
        有任何建议反馈也可点击主页右上角前往Github提交issuse。
      </p>
    </mu-card-text>
    <mu-divider></mu-divider>
    <mu-card-text>我有故事，你有酒吗？</mu-card-text>
  </mu-container>
</template>

<script>
export default {
};
</script>

<style>
  .container {
    padding-top: 50px;
  }
</style>
