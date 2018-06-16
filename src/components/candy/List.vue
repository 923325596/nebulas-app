<template>
  <div class="body">
    <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" />
    </div>
    <div class="list" v-if="list.length">
      <mu-paper :z-depth="1" class="list-wrap">
        <mu-list>
          <mu-sub-header>糖果列表</mu-sub-header>
          <mu-list-item
            avatar button :ripple="false"
            v-for="(item, index) in list"
            @click="selectItem(item)"
            :key="index">
            <mu-list-item-action>
              <mu-avatar>
                <avatar :avatar="item.author"></avatar>
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-title>{{item.title}}</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-paper>
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
      dappAddress: 'n1yvgpF2cSsHnBP4j2jQNgSZtSmhJASPZ75',
      hasExtension: true,
      id: 0,
      topPopup: false,
      pending: false,
      message: '',
      toast: false
    };
  },
  created () {
    this.switchNet(this.net);
    this.getCandyList();
  },
  methods: {
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
    getCandyList () {
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
      this.pending = true;
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        this.pending = false;
        let result = res.result;
        if (result === 'null') {
          this.result = [];
          return;
        }
        result = JSON.parse(result);
        this.list = result;
      }).catch(err => console.log(`error:${err}`));
    },
    selectItem (item) {
      this.$router.push({
        path: `/candy/detail/${item.id}`
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
    queryByHash (hash, successCb) {
      neb.api.getTransactionReceipt({hash}).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 0) {
          this.message = receipt.execute_error;
          this.pending = false;
          clearInterval(this.timer);
        }
        if (receipt.status === 2) {
          this.pending = true;
        }
        if (receipt.status === 1) {
          this.pending = false;
          console.error('clear', this.timer);
          clearInterval(this.timer);
          this.timer = null;
          successCb(receipt);
        }
      });
    },

    nebPayCall (callFunc, callArgs, value, cb, successCb) {
      this.serialNumber = nebPay.call(this.dappAddress, value, callFunc, callArgs, {
        listener: (res) => {
          if (!isPC()) {
            return;
          }
          if (res.txhash) {
            const hash = res.txhash;
            this.timer = setInterval(() => {
              this.queryByHash(hash, successCb);
              console.error('timer', this.timer);
            }, 5000);
          }
        }
      });
      if (!isPC()) {
        const queryTimer = setInterval(() => {
          const queryCb = (data) => {
            clearInterval(queryTimer);
            cb(data.hash);
            this.timer = setInterval(() => {
              console.error('timer', this.timer);
              this.queryByHash(data.hash, successCb);
            }, 5000);
          };
          this.queryInterval(queryCb);
        }, 3000);
      }
    },

    queryInterval (cb) {
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log(`tx result: ${res}`);
          const resObj = JSON.parse(res);
          console.log(resObj);
          if (resObj.msg === 'success') {
            cb && cb(resObj.data);
          }
        })
        .catch(function (err) {
          console.log('err', err);
        });
    }
  },
  components: {
    Avatar
  }
};
</script>

<style>
.body{
  background-color: white;
  border-radius: 5px;
  min-height: 900px;
  padding: 50px;
}

.mu-avatar {
  width: 50px !important;
  height: 50px !important;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left, .right {
  flex: 1;
}

.content {
  padding-bottom:100px;
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
  z-index: 9999;
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
