<template>
  <div class="content" v-if="questionDetail">
    <h2>{{questionDetail.title}}</h2>
    <div class="question" v-for="(question, index) in questionDetail.question" :key="index">
      <p>
        {{question.num}}&nbsp;{{question.title}}&nbsp;[{{typeObj[question.type]}}]
      </p>
      <el-radio-group v-model="formItem[question.num]" v-if="question.type === 'radio'">
        <el-radio
          :label="option"
          v-for="option in question.options"
          :key="option"
        >
        </el-radio>
      </el-radio-group>
      <el-checkbox-group v-model="formItem[question.num]" v-if="question.type === 'checkbox'">
        <el-checkbox
          v-for="option in question.options"
          :key="option"
          :label="option"
        >
        </el-checkbox>
      </el-checkbox-group>
      <el-input
        type="textarea"
        v-if="question.type === 'textarea'"
        v-model="formItem[question.num]"
      >
      </el-input>
    </div>
    <div class="submit" v-if="outdate">
        <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <div class="submit" v-else>
        <p>问卷已过期</p>
    </div>
  </div>
</template>

<script>
import Nebulas from 'nebulas';
import NebPay from 'nebpay.js';
import moment from 'moment';
import storage from '../../utils/storage';
import { isPC } from '../../utils/utils';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
export default {
  data () {
    return {
      questionList: storage.get(),
      questionDetail: {},
      formItem: {},
      id: '',
      typeObj: {
        radio: '单选',
        checkbox: '多选',
        textarea: '文本框'
      },
      type: [],
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1gGz8QkZevfryw2Z3sD48t6xzYThTZgFpC',
      outdate: false
    };
  },
  mounted () {
  },
  created () {
    this.switchNet(this.net);
    this.getQuestionDetail();
    // this.fetchData();
  },
  methods: {
    switchNet (value) {
      console.error(value);
      neb.setRequest(new Nebulas.HttpRequest(value));
      console.log(neb);
    },
    getQuestionDetail () {
      const id = this.$route.params.id;
      this.id = id;
      const from = Account.NewAccount().getAddressString();
      const value = '0';
      const nonce = '0';
      const gasPrice = '1000000';
      const gasLimit = '2000000';
      const callFunc = 'get';
      const callArgs = JSON.stringify([id]);
      const contract = {
        function: callFunc,
        args: callArgs
      };
      this.loading = this.$loading({
        fullscreen: true
      });
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        this.loading.close();
        let result = res.result;
        if (result === 'null') {
          this.result = [];
          return;
        }
        result = JSON.parse(result);
        this.questionDetail = result;
        if (!moment().isBefore(result.time)) {
          this.outdate = true;
        }
        this.getRequiredItem();
      }).catch(err => console.log(`error:${err}`));
    },
    fetchData () {
      const id = this.$route.params.id;
      let i = 0;
      for (let length = this.questionList.length; i < length; i++) {
        if (this.questionList[i].num === +id) {
          this.questionDetail = this.questionList[i];
          break;
        }
      }
      if (i === this.questionList.length) this.isError = true;
    },
    getRequiredItem () {
      this.questionDetail.question.forEach(item => {
        if (item.type === 'checkbox') {
          this.$set(this.formItem, item.num, []);
        } else {
          this.$set(this.formItem, item.num, '');
        }
      });
    },
    submit () {
      const value = '0';
      const callFunc = 'answer';
      const data = this.formItem;
      if (!this.validate()) {
        return this.$message.error('问卷还未填写完成');
      }
      const callArgs = JSON.stringify([this.id, data]);
      this.nebPayCall(callFunc, callArgs, value, () => {
        this.loading = this.$loading({
          fullscreen: true,
          text: '正在查询交易，请等待'
        });
      }, () => {
        this.loading.close();
        this.title = '';
        this.$message({
          message: '问卷提交成功',
          type: 'success'
        });
        this.$router.push({path: '/question/list'});
      });
    },
    validate () {
      for (let i in this.formItem) {
        if (this.formItem[i].length === 0) return false;
      }
      return true;
    },
    queryByHash (hash, successCb) {
      neb.api.getTransactionReceipt({hash}).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 0) {
          this.$message.error(receipt.execute_error);
          this.loading.close();
          clearInterval(this.timer);
        }
        if (receipt.status === 2) {
          this.loading = this.$loading({
            fullscreen: true,
            text: '正在查询交易，请等待'
          });
        }
        if (receipt.status === 1) {
          this.loading.close();
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
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

.question {
  padding: 20px 0;
}

p {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
