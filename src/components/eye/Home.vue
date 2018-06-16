<template>
  <div class="layout">
    <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" />
    </div>
    <mu-alert color="success" delete :show.sync="topPopup" transition="mu-scale-transition" class="alert">
        <mu-icon value="check_circle"></mu-icon> 更新成功
    </mu-alert>
    <mu-alert color="error" delete :show.sync="toast" class="mu-alert">
      <mu-icon value="warning"></mu-icon> {{message}}
    </mu-alert>
    <mu-appbar style="width: 100%;" color="primary">
      <div class="logo" slot="left">
          <a href="https://nebulas.io/cn/incentive.html"><img src="../../assets/nebulas.png" alt=""></a>
      </div>
      <router-link to="/eye">天眼-企业黑名单曝光平台</router-link>
      <mu-button flat slot="right" to="/eye/about">使用说明</mu-button>
      <mu-button href="https://github.com/YanYuanFE/nebulas-app" icon slot="right">
        <i class="mudocs-icon-custom-github"></i>
      </mu-button>
    </mu-appbar>
    <div class="content">
      <div class="body">
        <div class="app-row">
          <div class="left">
            <div class="row">
              <mu-text-field
                v-model="value"
                :disabled="!hasExtension"
                placeholder="输入你想查找的企业"
                :error-text="value ? '' : errorText"
                :max-length="30"/>
              <mu-button :style="{'margin-left': '10px'}" raised class="demo-raised-button" color="primary" @click="search">
                <mu-icon value="search" left></mu-icon>
                搜索
              </mu-button>
            </div>
            <div class="no-result" v-if="!result">
              <div class="row" :style="{'align-items': 'center'}">
                <span>
                  输入的企业没有记录！
                </span>
                <mu-button raised class="demo-raised-button" color="primary" @click="add">添加</mu-button>
              </div>
              <div class="row" v-if="visible">
                <mu-text-field
                  v-model="city"
                  placeholder="所在城市"
                  :error-text="city ? '' : errorText"
                  :max-length="30"/>
              </div>
              <div class="row" v-if="visible" :style="{'align-items': 'center'}">
                <mu-text-field
                  v-model="content"
                  placeholder="描述企业信息"
                  multi-line
                  :rows="3"
                  :rows-max="6"
                  :max-length="500"
                  :error-text="content ? '' : errorText"/>
                <mu-button raised class="demo-raised-button" color="primary" @click="submit">提交</mu-button>
              </div>
            </div>
            <div class="extension" v-if="!hasExtension">
              检测到你尚未安装星云钱包扩展<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
            </div>
          </div>
          <div class="right">
            <mu-card v-if="result && result.key">
              <mu-card-header title="搜索结果">
                <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" text-color="#FFF" slot="leftAvatar">
                  {{result.author.substr(-1, 1).toUpperCase()}}
                </mu-avatar>
              </mu-card-header>
              <mu-card-title :title="result.key" />
              <div class="result" >
                <mu-card-text>企业描述： {{result.value}}</mu-card-text>
                <mu-card-text>所在城市： {{result.city}}</mu-card-text>
                <mu-card-text>By： {{result.author}}</mu-card-text>
              </div>
              <mu-card-actions>
                <mu-button flat
                  @click="toggleAgree(result.key, true)"
                  class="flat-button" color="primary">
                  {{result.agree.length.toString()}}
                  <mu-icon right value="thumb_up"></mu-icon>
                </mu-button>
                <mu-button
                  flat
                  @click="toggleAgree(result.key, false)"
                  class="flat-button" color="secondary">
                  {{result.disagree.length.toString()}}
                  <mu-icon right value="thumb_down"></mu-icon>
                </mu-button>
              </mu-card-actions>
            </mu-card>
          </div>
        </div>
        <h2>目前共有{{list.length}}条企业记录</h2>
        <div class="card-wrapper" v-if="list.length">
          <mu-card v-for="(item, index) in pageList" :key="index" class="card">
            <mu-card-header :title="item.key">
              <mu-avatar
                color="blue100"
                :style="{'margin-left': '-8px'}"
                text-color="#FFF"
                slot="avatar"
              >
                <avatar :avatar="item.author"></avatar>
              </mu-avatar>
            </mu-card-header>
            <div class="result" >
              <mu-card-text>企业描述： {{item.value}}</mu-card-text>
              <mu-card-text>所在城市： {{item.city}}</mu-card-text>
              <mu-card-text>By： {{item.author}}</mu-card-text>
            </div>
            <mu-card-actions>
              <mu-button flat
                @click="toggleAgree(item.key,true)"
                class="flat-button" color="primary">
                {{item.agree.length.toString()}}
                <mu-icon right value="thumb_up"></mu-icon>
              </mu-button>
              <mu-button
                flat
                @click="toggleAgree(item.key, false)"
                class="flat-button" color="secondary">
                {{item.disagree.length.toString()}}
                <mu-icon right value="thumb_down"></mu-icon>
              </mu-button>
            </mu-card-actions>
          </mu-card>
        </div>
        <div class="pagination">
          <mu-pagination
            :total="list.length"
            v-if="list.length"
            :current.sync="currentPage"
            @change="handlePageChange"
          ></mu-pagination>
        </div>
      </div>
    </div>
    <div class="footer">
      天眼 ©2018 Powered by Nebulas
    </div>

  </div>
</template>
<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import { isPC } from '../../utils/utils';
import Avatar from '../../common/Avatar';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
const callbackUrl = NebPay.config.mainnetUrl;

export default {
  data () {
    return {
      value: '',
      content: '',
      city: '',
      result: true,
      visible: false,
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1exZbEUEkjMsdgqqgV6cRiDH1Y6uU7MDQT',
      hasExtension: true,
      list: [],
      topPopup: false,
      pending: false,
      current: '',
      message: '',
      toast: false,
      currentPage: 1,
      pageList: []
    };
  },
  created () {
    // this.init();
    console.log(isPC());
    this.switchNet(this.net);
    this.getCompanyList();
  },
  methods: {
    init () {
      try {
        if (typeof (webExtensionWallet) !== 'undefined') {
          // this.hasExtension = true;
        } else {
          throw new Error('Extension wallet is not installed, please install it first.');
        }
      } catch (e) {
        // this.hasExtension = false;
        console.log(e);
      }
    },
    getCompanyList () {
      this.pending = true;
      const from = Account.NewAccount().getAddressString();
      const value = '0';
      const nonce = '0';
      const gasPrice = '1000000';
      const gasLimit = '2000000';
      const callFunc = 'list';
      const callArgs = '';
      const contract = {
        function: callFunc,
        args: callArgs
      };
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        let result = res.result;
        if (result === 'null') {
          this.result = [];
          return;
        }
        result = JSON.parse(result);
        this.list = result;
        this.pending = false;
        this.handlePageChange(1);
      }).catch(err => console.log(`error:${err}`));
    },
    getItemDetail (name) {
      this.current = name;
      const from = Account.NewAccount().getAddressString();
      const value = '0';
      const nonce = '0';
      const gasPrice = '1000000';
      const gasLimit = '2000000';
      const callFunc = 'get';
      const callArgs = JSON.stringify([name]);
      const contract = {
        function: callFunc,
        args: callArgs
      };
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        this.afterSearch(res);
      }).catch(err => console.log(`error:${err}`));
    },
    handlePageChange (page) {
      this.currentPage = page;
      this.pageList = this.list.slice((page - 1) * 10, page * 10);
    },
    switchNet (value) {
      // neb.setRequest(new Nebulas.HttpRequest("localhost:8685"));
      neb.setRequest(new Nebulas.HttpRequest(value));
    },
    search () {
      if (!this.value && this.value !== 0) {
        this.errorText = '请输入';
        return;
      };
      this.getItemDetail(this.value);
    },
    afterSearch (res) {
      console.log(res);
      let result = res.result;
      if (result === 'null') {
        this.result = false;
        // this.showToast(res.execute_err);
        return;
      }
      if (result.execute_err) {
        alert(result.execute_err);
      }
      result = JSON.parse(result);
      if (result.key) {
        this.result = result;
      } else {
        this.result = null;
      }
    },
    add () {
      this.visible = true;
    },
    submit () {
      if (!this.value || !this.content || !this.city) {
        this.errorText = '请输入';
        return;
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'save';
      const callArgs = JSON.stringify([this.value, this.content, this.city]);
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush,
        callback: callbackUrl
      });
      if (!isPC()) {
        this.queryTimer = setInterval(() => {
          this.queryInterval();
        }, 5000);
      }
    },
    cbPush (res) {
      var resObj = res;
      console.log(`res of push:${JSON.stringify(res)}`);
      if (!res.txhash) {
        this.message = '您取消了交易！';
        this.showToast();
        return;
      }
      if (!isPC()) {
        return;
      }
      const hash = resObj.txhash;
      this.timer = setInterval(() => {
        neb.api.getTransactionReceipt({hash}).then((receipt) => {
          console.log(receipt);
          if (receipt.status === 0) {
            this.message = receipt.execute_error;
            this.showToast();
            this.pending = false;
            clearInterval(this.timer);
          }
          if (receipt.status === 2) {
            this.pending = true;
          }
          if (receipt.status === 1) {
            this.pending = false;
            clearInterval(this.timer);
            this.topPopup = true;
            setTimeout(() => {
              this.topPopup = false;
            }, 2000);
            this.getCompanyList();
            if (this.current) {
              this.getItemDetail(this.current);
            }
            this.value = '';
            this.content = '';
            this.city = '';
          }
        });
      }, 5000);
    },
    queryInterval () {
      if (!this.serialNumber) return;
      this.pending = true;
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log(`tx result: ${res}`);
          const resObj = JSON.parse(res);
          console.log(resObj);
          if (resObj.code === 0 && resObj.data.status === 1) {
            this.topPopup = true;
            setTimeout(() => {
              this.topPopup = false;
            }, 2000);
            clearInterval(this.queryTimer);
            console.error(this.queryTimer);
            this.pending = false;
            this.getCompanyList();
            if (this.current) {
              this.getItemDetail(this.current);
            }
          }
        })
        .catch(function (err) {
          console.log('err', err);
          clearInterval(this.queryTimer);
          this.pending = false;
        });
    },
    toggleAgree (key, isAgree) {
      if (!this.hasExtension) {
        this.message = '请先安装星云扩展钱包插件！';
        this.showToast();
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'toggleAgree';
      const callArgs = JSON.stringify([key, isAgree]);
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush,
        callback: callbackUrl
      });
      if (!isPC()) {
        this.queryTimer = setInterval(() => {
          this.queryInterval();
        }, 5000);
      }
    },
    showToast () {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = false; }, 2000);
    },
    hideToast () {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    }
  },
  components: {
    Avatar
  }
};
</script>
<style scoped>
.layout{
  background-color: #eee;
}

.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.header{
  /* background-color: #7e57c2; */
}

.title{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.logo {
  display: inline-block;
  vertical-align: middle;
}

.github {
  display: inline-block;
  float: right;
  padding-right: 20px;
}

.github i {
  color: #FFF;
  font-size: 34px;
}

.logo img {
  width: 35px;
  height: 35px;
}

.nav{
  display: inline-block;
  width: calc(100% - 150px);
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0);
}

.content{
  width: 100%;
  /* height: 100%; */
  margin: 0 auto;
  background-color: #eee;
  padding-bottom:220px;
  /* display: flex;
  justify-content: center; */
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  /* background-color: white; */
  border-radius: 5px;
  min-height: 500px;
  padding: 50px 50px 0 50px;
  /* max-width: 1100px; */
}

.mu-avatar {
  width: 50px !important;
  height: 50px !important;
}

.left, .right {
  width: 520px;
  padding: 20px;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
}

.card {
  width: 100%;
  max-width: 375px;
  margin: 0 20px 20px 0;
}

.pagination .mu-pagination {
  float: right;
}

.right {
  margin-left: 50px;
}

.footer{
  padding: 20px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #777;
  background-color: #1b1b1b;
}

.row {
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  margin-bottom: 20px;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

@media screen and (max-width: 768px) {
    .body {
       padding: 20px 20px 0 20px;
    }
    .app-row, .row {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .card {
      margin: 0 0 20px 0;
    }
    .left, .right {
      width: 100%;
    }
    .right {
      padding: 0px;
      margin-left: 0;
    }
}

.mu-appbar-title a {
  color: #FFF
}
</style>
