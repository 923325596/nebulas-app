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
        星云Home
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
        <div class="button-container">
          <mu-button raised class="demo-raised-button" color="primary" @click="showForm('rent')">我要租房</mu-button>
          <mu-button raised class="demo-raised-button" color="primary" @click="showForm('owner')">我是房东</mu-button>
        </div>
        <div class="app-row">
          <div class="left">
            <div class="row" v-if="visible">
              <mu-text-field
                v-model="title"
                :disabled="!hasExtension"
                hintText="标题"
                :errorText="title ? '' : errorText"
                :maxLength="30"/>
              <mu-text-field
                v-model="name"
                :disabled="!hasExtension"
                hintText="我的名字"
                :errorText="name ? '' : errorText"
                :maxLength="30"/>
              <mu-text-field
                v-model="phone"
                :disabled="!hasExtension"
                hintText="联系方式"
                :errorText="phone ? '' : errorText"
                :maxLength="30"/>
              <mu-text-field
                v-model="area"
                :disabled="!hasExtension"
                hintText="房屋位置"
                :errorText="area ? '' : errorText"
                :maxLength="30"/>
              <mu-text-field
                  v-model="content"
                  hintText="详细信息"
                  multiLine
                  :rows="3"
                  :rowsMax="6"
                  :maxLength="500"
                  :errorText="content ? '' : errorText"/>
              <mu-raised-button label="提交" class="demo-raised-button" primary @click="submit"/>
            </div>
            <div class="extension" v-if="!hasExtension">
              检测到你尚未安装星云钱包扩展<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
            </div>
          </div>
          <div class="right">
          </div>
        </div>
        <mu-tabs :value.sync="activeTab">
          <mu-tab>求租信息</mu-tab>
          <mu-tab>租房信息</mu-tab>
        </mu-tabs>
        <div v-if="activeTab === 0">
          <div class="card">
            <mu-flexbox v-if="rentList.length">
             <mu-flexbox-item class="flex-demo" v-for="item in rentList" :key="item.author">
               <mu-card>
                  <mu-card-header title="租房详情">
                    <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" backgroundColor="transparent" slot="leftAvatar">
                      {{item.author.substr(-1, 1).toUpperCase()}}
                    </mu-avatar>
                  </mu-card-header>
                  <div class="result" >
                    <mu-card-text>标题： {{item.title}}</mu-card-text>
                    <mu-card-text>姓名： {{item.name}}</mu-card-text>
                    <mu-card-text>联系方式： {{item.phone}}</mu-card-text>
                    <mu-card-text>房屋位置： {{item.area}}</mu-card-text>
                    <mu-card-text>详细信息： {{item.content}}</mu-card-text>
                    <mu-card-text>By： {{item.author}}</mu-card-text>
                  </div>
                  <mu-card-actions>
                    <mu-raised-button
                      @click="deleteItem(item.author)"
                      label="已租到" class="flat-button"  secondary/>
                  </mu-card-actions>
                </mu-card>
              </mu-flexbox-item>
            </mu-flexbox>
          </div>
        </div>
        <div v-if="activeTab === 1">
          <div class="card">
            <mu-flexbox v-if="ownerList.length">
             <mu-flexbox-item class="flex-demo" v-for="item in ownerList" :key="item.author">
               <mu-card>
                  <mu-card-header title="租房详情">
                    <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" backgroundColor="transparent" slot="leftAvatar">
                      {{item.author.substr(-1, 1).toUpperCase()}}
                    </mu-avatar>
                  </mu-card-header>
                  <div class="result" >
                    <mu-card-text>标题： {{item.title}}</mu-card-text>
                    <mu-card-text>姓名： {{item.name}}</mu-card-text>
                    <mu-card-text>联系方式： {{item.phone}}</mu-card-text>
                    <mu-card-text>房屋位置： {{item.area}}</mu-card-text>
                    <mu-card-text>详细信息： {{item.content}}</mu-card-text>
                    <mu-card-text>By： {{item.author}}</mu-card-text>
                  </div>
                  <mu-card-actions>
                    <mu-button raised class="demo-raised-button" color="secondary" @click="deleteItem(item.author)">已出租</mu-button>
                  </mu-card-actions>
                </mu-card>
              </mu-flexbox-item>
            </mu-flexbox>
          </div>
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
import { setTimeout } from 'timers';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();

export default {
  data () {
    return {
      title: '',
      name: '',
      phone: '',
      area: '',
      content: '',
      city: '',
      isRent: true,
      visible: false,
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1oyT36xYjgMVHG55rJHcxwAuLCrJzKMrGZ',
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
      toast: false,
      activeTab: 0,
      rentList: [],
      ownerList: []
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
    this.getHouseList();
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
    showForm (user) {
      this.visible = true;
      if (user === 'rent') {
        this.isRent = true;
      } else {
        this.isRent = false;
      }
    },
    getHouseList () {
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
        this.rentList = result.filter(item => item.isRent);
        this.ownerList = result.filter(item => !item.isRent);
      }).catch(err => console.log(`error:${err}`));
    },
    handleTabChange (val) {
      this.activeTab = val;
    },
    deleteItem (author) {
      const value = '0';
      const to = this.dappAddress;
      const callFunc = 'del';
      const callArgs = JSON.stringify([author]);
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush
      });
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
      if (!this.name || !this.content || !this.area || !this.phone || !this.title) {
        this.errorText = '请输入';
        return;
      }
      const to = this.dappAddress;
      const value = '0';
      const callFunc = 'add';
      const callArgs = JSON.stringify([this.title, this.name, this.phone, this.area, this.content, this.isRent]);
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
            this.getHouseList();
            this.name = '';
            this.content = '';
            this.phone = '';
            this.title = '';
            this.area = '';
            this.visible = false;
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

.button-container {
  margin-bottom: 30px;
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
  margin-top: 20px;
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
