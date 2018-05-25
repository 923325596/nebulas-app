<template>
  <div class="layout">
     <mu-toast v-if="toast" :message="message" @close="hideToast"/>
     <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" color="red"/>
     </div>
     <mu-popup position="top" :overlay="false" popupClass="popup" :open="topPopup">
      更新成功
    </mu-popup>
    <div class="header">
      <div class="title">
        天眼
      </div>
      <div class="logo">
        <a href="https://nebulas.io/cn/incentive.html"><img src="../assets/nebulasx60.png" alt=""></a>
      </div>
      <div class="github">
        <mu-icon-button href="https://github.com/YanYuanFE/nebulas-app">
          <i class="mudocs-icon-custom-github"></i>
        </mu-icon-button>
      </div>
    </div>
    <div class="content">
      <div class="body">
        <div class="app-row">
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
                  v-model="city"
                  hintText="所在城市"
                  :errorText="city ? '' : errorText"
                  :maxLength="30"/>
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
            <div class="extension" v-if="!hasExtension">
              检测到你尚未安装星云钱包扩展<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
            </div>
          </div>
          <div class="right">
            <div class="list" v-if="list.length">
              <mobile-tear-sheet>
                <mu-list>
                  <mu-sub-header>企业列表</mu-sub-header>
                  <mu-list-item
                    :title="item.key"
                    v-for="(item, index) in list"
                    @click="getItemDetail(item.key)"
                    :key="index">
                    <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" backgroundColor="transparent" slot="leftAvatar">
                      {{item.author.substr(-1, 1).toUpperCase()}}
                    </mu-avatar>
                  </mu-list-item>
                </mu-list>
              </mobile-tear-sheet>
            </div>
          </div>
        </div>
        <div class="card">
          <mu-card v-if="result && result.key">
            <mu-card-header title="企业详情">
              <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" backgroundColor="transparent" slot="leftAvatar">
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
              <mu-flat-button
                @click="toggleAgree(true)"
                :label="result.agree.length.toString()" class="flat-button" icon="thumb_up" primary/>
              <mu-flat-button
                @click="toggleAgree(false)"
                :label="result.disagree.length.toString()" class="flat-button" icon="thumb_down" secondary/>
            </mu-card-actions>
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
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import mobileTearSheet from '../common/mobileTearSheet';
import { setTimeout } from 'timers';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
// const dappAddress = 'n1zo1HT9cbJTYKhsXM7jfpC8Hh8uiUuP79T';
// 'n1utupNggY4GV4JynFX45kURgtSCv5xhpek';
// cd $GOPATH/src/github.com/nebulasio/go-nebulas
// ./neb -c conf/default/config.conf
// hash 666befeaabe0dcc149aa9f24ab5ba4ecd0f7b94703b2d89679279baf4d8eda3f

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
      netArr: [{
        label: 'TestNet',
        value: 'https://testnet.nebulas.io',
        address: 'n1zo1HT9cbJTYKhsXM7jfpC8Hh8uiUuP79T'
      }, {
        label: 'MainNet',
        value: 'https://mainnet.nebulas.io',
        address: 'n1emrHvHnDAHeeqQjCXhCUfgiDztxDJupa5'
      }],
      hasExtension: false,
      list: [],
      topPopup: false,
      pending: false,
      current: '',
      message: '',
      toast: false
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
    this.getCompanyList();
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
    getCompanyList () {
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
    handleChange (value) {
      console.log(value);
      this.net = value;
      const currentIndex = this.netArr.findIndex((item) => item.value === value);
      this.dappAddress = this.netArr[currentIndex].address;
      this.switchNet(value);
    },
    switchNet (value) {
      // neb.setRequest(new Nebulas.HttpRequest("localhost:8685"));
      console.log(value);
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
        listener: this.cbPush
      });

      // this.timer = setInterval(() => {
      //   this.queryInterval();
      // }, 5000);
    },
    toggleAgree (isAgree) {
      if (!this.hasExtension) {
        this.message = '请先安装星云扩展钱包插件！';
        this.showToast();
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'toggleAgree';
      const callArgs = JSON.stringify([this.result.key, isAgree]);
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush
      });
    },
    showToast () {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = false; }, 2000);
    },
    hideToast () {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    },
    cbPush (res) {
      var resObj = res;
      console.log(`res of push:${JSON.stringify(res)}`);
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
            console.log(this.current);
            this.getItemDetail(this.current);
            this.value = '';
            this.content = '';
            this.city = '';
          }
        });
      }, 5000);
    },
    queryInterval () {
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log(`tx result: ${res}`);
          const resObj = JSON.parse(res);
          console.log(resObj);
          if (resObj.code === 0 && resObj.data.status === 1) {
            alert(`set ${this.value} succeed!`);
            clearInterval(this.timer);
          } else {
            console.log(resObj);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  },
  components: {
    'mobile-tear-sheet': mobileTearSheet
  }
};
</script>
<style scoped>
.layout{
  background-color: rgb(236, 236, 236);
}

.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.header{
  background-color: #7e57c2;
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
  width: 145px;
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
  /* display: flex;
  justify-content: center; */
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
  padding: 50px;
  /* max-width: 1100px; */
}

.left, .right {
  width: 520px;
  padding: 20px;
}

.card {
  max-width: 1200px;
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
  background-color: rgb(236, 236, 236);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
</style>
