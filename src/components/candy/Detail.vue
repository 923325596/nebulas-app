<template>
  <div class="detail">
    <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" color="secondary" />
    </div>
    <mu-alert color="success" delete :show.sync="topPopup" transition="mu-scale-transition" class="alert">
        <mu-icon value="check_circle"></mu-icon> 更新成功
    </mu-alert>
    <mu-alert color="error" delete :show.sync="toast" class="mu-alert">
      <mu-icon value="warning"></mu-icon> {{message}}
    </mu-alert>
    <mu-card v-if="detail.author">
      <mu-card-title title="糖果详情"></mu-card-title>
      <mu-card-header :title="detail.title" :subTitle="`By:${detail.author}`">
      </mu-card-header>
      <mu-divider />
      <mu-card-text v-html="detail.description">
      </mu-card-text>
      <mu-divider />
      <mu-card-text>
        <mu-list>
          <mu-sub-header>评论</mu-sub-header>
          <mu-card-text v-if="!detail.comments.length">暂无评论</mu-card-text>
          <mu-list-item avatar button :ripple="false" v-for="(item, index) in detail.comments" :key="index">
            <mu-list-item-action>
              <mu-avatar>
                <avatar :avatar="item.author"/>
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-title>{{item.data}}</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-card-text>
      <mu-card-actions>
        <mu-button flat
          @click="toggleAgree(detail.id,true)"
          class="flat-button" color="primary">
          {{detail.agree.length.toString()}}
          <mu-icon right value="thumb_up"></mu-icon>
        </mu-button>
        <mu-button
          flat
          @click="toggleAgree(detail.id, false)"
          class="flat-button" color="secondary">
          {{detail.disagree.length.toString()}}
          <mu-icon right value="thumb_down"></mu-icon>
        </mu-button>
      </mu-card-actions>
      <mu-card-actions>
        <mu-text-field
          full-width
          v-model="comment"
          multi-line
          :rows="1"
          :rows-max="3"
          :max-length="500"
          :disabled="!hasExtension"
          placeholder="这个糖果怎么样..."
          :error-text="value ? '' : errorText"/>
          <mu-card-actions>
            <mu-button raised class="demo-raised-button" color="secondary" @click="handleSubmit">提交 </mu-button>
          </mu-card-actions>
      </mu-card-actions>
    </mu-card>
    </div>
</template>

<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import Avatar from '../../common/Avatar';

import { isPC } from '../../utils/utils';
import { setTimeout } from 'timers';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
export default {
  data () {
    return {
      pending: false,
      value: '',
      content: '',
      list: [],
      detail: [],
      visible: false,
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1yvgpF2cSsHnBP4j2jQNgSZtSmhJASPZ75',
      hasExtension: true,
      comment: '',
      id: 0,
      topPopup: false,
      message: '',
      toast: false
    };
  },
  created () {
    this.switchNet(this.net);
    this.getCandyDetail();
  },
  methods: {
    switchNet (value) {
      neb.setRequest(new Nebulas.HttpRequest(value));
    },
    getCandyDetail () {
      const id = this.$route.params.id;
      this.id = id;
      const from = Account.NewAccount().getAddressString();
      const value = '0';
      const nonce = '0';
      const gasPrice = '1000000';
      const gasLimit = '2000000';
      const callFunc = 'get';
      const callArgs = JSON.stringify([parseInt(id)]);
      const contract = {
        function: callFunc,
        args: callArgs
      };
      this.pending = true;
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        let result = res.result;
        if (result === 'null') {
          this.result = [];
          return;
        }
        result = JSON.parse(result);
        this.detail = result;
        console.log(result);
        this.pending = false;
      }).catch(err => console.log(`error:${err}`));
    },
    handleSubmit () {
      const id = this.$route.params.id;
      const value = '0';
      const callFunc = 'comment';
      const callArgs = JSON.stringify([id, this.comment]);
      this.nebPayCall(callFunc, callArgs, value, () => {
        this.pending = true;
      }, () => {
        this.getCandyDetail();
        this.pending = false;
        this.topPopup = true;
        this.comment = '';
        setTimeout(() => {
          this.topPopup = false;
        }, 2000);
      });
    },
    toggleAgree (id, isAgree) {
      if (!this.hasExtension) {
        this.message = '请先安装星云扩展钱包插件！';
        this.showToast();
      }
      const value = '0';
      const callFunc = 'toggleAgree';
      const callArgs = JSON.stringify([id, isAgree]);
      this.nebPayCall(callFunc, callArgs, value, () => {
        this.pending = true;
      }, () => {
        this.getCandyDetail();
        this.pending = false;
        this.topPopup = true;
        this.comment = '';
        setTimeout(() => {
          this.topPopup = false;
        }, 2000);
      });
    },
    showToast () {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = false; }, 2000);
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
.detail{
  background-color: white;
  border-radius: 5px;
  min-height: 900px;
  padding-bottom: 100px;
}

@media screen and (max-width: 768px) {
  .detail {
    padding: 0px;
  }
}

.mu-avatar {
  width: 50px !important;
  height: 50px !important;
}

.mu-card {
  padding: 16px;
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
</style>
