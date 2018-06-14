<template>
  <div class="body">
    <div class="list" v-if="list.length">
      <mu-paper :z-depth="1" class="list-wrap">
        <mu-list>
          <mu-sub-header>糖果列表</mu-sub-header>
          <mu-list-item
            avatar button :ripple="false"
            v-for="(item, index) in list"
            @click="getStoryDetail(index)"
            :key="index">
            <mu-list-item-action>
              <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" text-color="#FFF" slot="leftAvatar">
                {{item.author.substr(-1, 1).toUpperCase()}}
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-title>{{item.content[0].content}}</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-paper>
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
            multi-line
            :rows="3"
            :rows-max="6"
            :max-length="500"
            :disabled="!hasExtension"
            placeholder="续写故事"
            :error-text="value ? '' : errorText"/>
            <mu-card-actions>
              <mu-button raised class="demo-raised-button" color="primary" @click="write">提交 </mu-button>
            </mu-card-actions>
        </div>
      </mu-card>
    </div>
  </div>
</template>

<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
export default {
  data () {
    return {
      open: true,
      docked: true,
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
      hasExtension: true,
      writeVal: '',
      id: 0,
      topPopup: false,
      pending: false,
      message: '',
      toast: false
    };
  },
  created () {
    // this.init();
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
      this.queryTimer = setInterval(() => {
        this.queryInterval();
      }, 5000);
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
            this.queryTimer && clearInterval(this.queryTimer);
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
    queryInterval () {
      if (!this.serialNumber) return;
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log(`tx result: ${res}`);
          const resObj = JSON.parse(res);
          if (resObj.code === 0) {
            // alert(`write story succeed!`);
            this.topPopup = true;
            setTimeout(() => {
              this.topPopup = false;
            }, 2000);
            clearInterval(this.queryTimer);
            this.getStoryList();
          }
        });
    }
  }
};
</script>

<style>
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

.content {
  padding-bottom:100px;
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

.list-wrap {
  width: 100%;
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
      margin-top: 20px;
    }
    .mu-card-sub-title {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
}
</style>
