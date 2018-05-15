<template>
<div class="layout">
    <div class="header">
      <div class="title">
        天眼
      </div>
      <div class="logo">
        <img src="../assets/nebulasx60.png" alt="">
      </div>
      <div class="right">
        <a href="https://github.com/YanYuanFE/nebulas-app">
          <mu-icon value="code" color="#FFF" :size="32"/>
        </a>
      </div>
    </div>
    <div class="content">
      <div class="net">
        <mu-dropDown-menu :value="net" @change="handleChange">
          <mu-menu-item
            :value="item.value"
            :title="item.label"
            :key="item.value"
            v-for="item in netArr"/>
        </mu-dropDown-menu>
      </div>
      <div class="body">
        <div class="left">
          <div class="row">
            <mu-text-field
              v-model="value"
              :disabled="!hasExtension"
              hintText="输入你想查找的企业"
              :errorText="value ? '' : errorText"
              :maxLength="30"/>
            <mu-raised-button label="搜索" class="demo-raised-button" primary @click="search"/>
          </div>

          <div class="no-result" v-if="!result">
            <div class="row">
              <span>
                输入的企业没有记录！
              </span>
              <mu-raised-button label="添加" class="demo-raised-button" primary @click="add"/>
            </div>
            <div class="row" v-if="visible">
              <mu-text-field
                v-model="content"
                hintText="描述企业信息"
                multiLine
                :rows="3"
                :rowsMax="6"
                :maxLength="500"
                :errorText="content ? '' : errorText"/>
              <mu-raised-button label="提交" class="demo-raised-button" primary @click="submit"/>
            </div>
          </div>
          <div class="result" v-if="result && result.key">
            <div class="name">公司名称： {{result.key}}</div>
            <div class="description">公司信息： {{result.value}}</div>
            <div class="author">提交人： {{result.author}}</div>
          </div>
          <div class="extension" v-if="!hasExtension">
            检测到你尚未安装星云钱包<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
          </div>
        </div>
        <div class="right">
          <mu-card>
            <mu-card-header title="星云" subTitle="天眼">
            </mu-card-header>
            <mu-card-text>
              天眼是基于星云链开发的DApp，通过区块链去中心化的透明机制，用于求职者爆料虚假企业、黑心企业，
              用户通过搜索企业名称查询是否在区块链数据库中，未查询到信息则可以添加相关描述提交相关信息。
            </mu-card-text>
          </mu-card>
        </div>
      </div>
    </div>
    <div class="footer">
      天眼 ©2018 Created by Nebulas
    </div>

  </div>
</template>

<script>
// import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';

// const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
// const nebPay = new NebPay();
export default {
  data () {
    return {
      value: '',
      content: '',
      result: true,
      visible: false,
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1emrHvHnDAHeeqQjCXhCUfgiDztxDJupa5',
      netArr: [{
        label: 'TestNet',
        value: 'https://testnet.nebulas.io',
        address: 'n1zo1HT9cbJTYKhsXM7jfpC8Hh8uiUuP79T'
      }, {
        label: 'MainNet',
        value: 'https://mainnet.nebulas.io',
        address: 'n1emrHvHnDAHeeqQjCXhCUfgiDztxDJupa5'
      }],
      hasExtension: false
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
  },
  methods: {
    init () {
      try {
        if (typeof (webExtensionWallet) !== 'undefined') {
          this.hasExtension = true;
        } else {
          throw new Error('Extension wallet is not installed, please install it first.');
        }
      } catch (e) {
        this.hasExtension = false;
        console.log(e);
      }
    },
    switchNet (value) {
      // neb.setRequest(new Nebulas.HttpRequest("localhost:8685"));
      console.log(value);
      neb.setRequest(new Nebulas.HttpRequest(value));
    }
  }
};
</script>

<style scoped>

</style>
