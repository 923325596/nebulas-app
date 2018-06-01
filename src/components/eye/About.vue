<template>
  <mu-container>
    <mu-button raised color="primary" to="/eye/home">返回</mu-button>
    <mu-card-text>
      <ul>
        1. 需要提前准备什么？
        <li>
          <p>
          为正常使用网站提供的功能，请使用Chrome浏览器，并且安装插件 WebExtensionWallet。
          WebExtensionWallet 是星云链官方指定的chrome插件，通过它可以方便我们转账、调用智能合约。
          </p>
          <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">下载插件</a>
        </li>
      </ul>
    </mu-card-text>
    <mu-divider></mu-divider>
    <mu-card-text>
      <ul>
        2. 基本使用方法是什么？
        <li>
          <p>
            进入<router-link to="/eye/home">主页</router-link>，可以看到所有记录的黑名单企业列表，你可以通过输入框搜索相关的企业，如果没有搜索结果，你可以选择添加记录，
            对于某个企业，你可以选择为该条记录选择同意或者反对该记录。
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
            对于提交记录和进行同意反对操作需要消耗极少量的手续费Gas。
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
