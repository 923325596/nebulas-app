<template>
  <div class="layout">
    <mu-toast v-if="toast" :message="message" @close="hideToast"/>
     <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" />
     </div>
     <mu-popup position="top" :overlay="false" popupClass="popup" :open="topPopup">
      更新成功
    </mu-popup>
    <div class="header">
      <div class="title">
        星云故事接龙
      </div>
      <div class="logo">
        <a href="https://nebulas.io/cn/incentive.html"><img src="../../assets/nebulasx60.png" alt=""></a>
      </div>
      <div class="github">
        <mu-button to="https://github.com/YanYuanFE/nebulas-app" icon>
          <i class="mudocs-icon-custom-github"></i>
        </mu-button>
      </div>
    </div>
    <div class="content">
      <div class="body">
        <div class="app-row">
          <div class="left">
            <mu-card>
              <mu-card-header title="开始你的故事" >
              </mu-card-header>
              <div class="card-content">
                <mu-text-field
                  v-model="value"
                  multiLine
                  :rows="3"
                  :rowsMax="6"
                  :maxLength="500"
                  :disabled="!hasExtension"
                  hintText="输入故事开始"
                  :errorText="value ? '' : errorText"/>
                  <mu-card-actions>
                    <mu-raised-button label="提交" class="demo-raised-button" primary @click="add"/>
                  </mu-card-actions>
              </div>
            </mu-card>
            <div class="extension" v-if="!hasExtension">
              检测到你尚未安装星云钱包<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
            </div>
          </div>
          <div class="right">
            <div class="list" v-if="list.length">
              <mobile-tear-sheet>
                <mu-list>
                  <mu-sub-header>故事列表</mu-sub-header>
                  <mu-list-item
                    :title="item.content[0].content"
                    v-for="(item, index) in list"
                    @click="getStoryDetail(index)"
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
        <div class="detail" v-if="detail.author">
          <mu-card>
            <mu-card-header title="故事详情" :subTitle="`Author:${detail.author}`">
              <mu-avatar
                color="pinkA200"
                :style="{'margin-left': '-8px'}"
                backgroundColor="transparent"
                slot="avatar">
                {{detail.author.substr(-1, 1).toUpperCase()}}
              </mu-avatar>
            </mu-card-header>
            <mu-card-text v-for="text in detail.content" :key="text.content">
              <span class="author">By:{{text.from}}</span>:{{text.content}}
            </mu-card-text>
            <div class="card-content">
              <mu-text-field
                v-model="writeVal"
                multiLine
                :rows="3"
                :rowsMax="6"
                :maxLength="500"
                :disabled="!hasExtension"
                hintText="续写故事"
                :errorText="value ? '' : errorText"/>
                <mu-card-actions>
                  <mu-raised-button label="提交" class="demo-raised-button" primary @click="write"/>
                </mu-card-actions>
            </div>
          </mu-card>
        </div>
      </div>
    </div>
    <div class="footer">
       ©2018 Created by Nebulas
    </div>

  </div>
</template>
<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import mobileTearSheet from '../../common/mobileTearSheet';

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
      list: [],
      detail: [],
      visible: false,
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1gCBrwMTA2om2Unkmvu99MYchFCH1Ca83h',
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
      writeVal: '',
      id: 0,
      topPopup: false,
      pending: false,
      message: '',
      toast: false
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
    this.getStoryList();
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
    getStoryList () {
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
    getStoryDetail (index) {
      this.id = index;
      const from = Account.NewAccount().getAddressString();
      const value = '0';
      const nonce = '0';
      const gasPrice = '1000000';
      const gasLimit = '2000000';
      const callFunc = 'get';
      const callArgs = JSON.stringify([index]);
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
        this.detail = result;
        console.log(result);
      }).catch(err => console.log(`error:${err}`));
    },
    add () {
      if (!this.value) {
        this.errorText = '请输入';
        return;
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'add';
      const callArgs = JSON.stringify([this.value]);
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush
      });
    },
    write () {
      if (!this.writeVal) {
        this.errorText = '请输入';
        return;
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'write';
      const callArgs = JSON.stringify([this.id, this.writeVal]);
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
            this.getStoryList();
            this.value = '';
            this.writeVal = '';
          }
        });
      }, 5000);
    },
    queryInterval (cb) {
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log(`tx result: ${res}`);
          const resObj = JSON.parse(res);
          if (resObj.code === 0) {
            alert(`write story succeed!`);
            cb();
            clearInterval(this.timer);
          }
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
  background-color: #2196f3;
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
  margin: 0 auto;
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
  padding: 50px;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left, .right {
  flex: 1;
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

.detail {
  margin-top: 20px;
}

.card-content {
  padding: 16px;
}

.mu-text-field {
  width: 100%;
}

.author {
  font-size: 14px;
  color: #666;
  margin-right: 5px;
}
</style>
