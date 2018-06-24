<template>
  <el-card class="box-card">
    <div class="content" v-if="questionDetail">
      <h2>{{questionDetail.title}}</h2>
      <div class="question" v-for="(question, index) in questionDetail.question" :key="index">
        <div class="question-row">
            <div class="question-left">
              <p>
                {{question.num}}&nbsp;{{question.title}}&nbsp;({{typeObj[question.type]}})
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
            <div class="question-right" v-if="chartData[question.num]">
              <v-chart :forceFit="true" :height="height" :data="chartData[question.num]" :scale="scale" v-if="!chartData[question.num].type && scale">
                <v-tooltip :showTitle="false" dataKey="item*percent" />
                <v-axis />
                <v-legend dataKey="item" />
                <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
                <v-coord type="theta" />
              </v-chart>
              <div class="progress" v-if="question.type === 'textarea'">
                <p>有效回答占比</p>
                <el-progress class="progress-bar" :text-inside="true" :stroke-width="18" :percentage="chartData[question.num].percent"></el-progress>
              </div>
            </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Nebulas from 'nebulas';
import NebPay from 'nebpay.js';
import DataSet from '@antv/data-set';
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
      outdate: false,
      scale: null,
      chartData: {

      },
      height: 200,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val;
        }
      }]
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
      neb.setRequest(new Nebulas.HttpRequest(value));
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
        this.formatData();
      }).catch(err => console.log(`error:${err}`));
    },
    formatData () {
      const {answers, question} = this.questionDetail;
      let chartData = {};
      question.forEach(item => {
        const num = item.num;
        let sourceData;
        if (item.type !== 'textarea') {
          sourceData = item.options.map(option => ({
            item: option,
            count: 0
          }));
          chartData[num] = sourceData;
        } else {
          chartData[num] = {
            type: 'textarea',
            all: answers.length,
            valid: 0
          };
        }
      });
      answers.forEach(answer => {
        const data = answer.data;
        Object.keys(data).forEach(key => {
          if (!Array.isArray(chartData[key])) {
            if (data[key] !== '') chartData[key].valid += 1;
            chartData[key].percent = chartData[key].valid * 100 / chartData[key].all;
          } else {
            chartData[key].forEach(item => {
              if (Array.isArray(data[key])) {
                if (data[key].indexOf(item.item) !== -1) {
                  item.count += 1;
                }
              } else {
                if (item.item === data[key]) {
                  item.count += 1;
                }
              }
            });
          }
        });
      });
      console.error(chartData);
      this.chartData = chartData;
      this.renderChart();
    },
    renderChart () {
      const chartData = this.chartData;
      const scale = [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }];
      Object.keys(chartData).forEach(key => {
        if (Array.isArray(chartData[key])) {
          const dv = new DataSet.View().source(chartData[key]);
          dv.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
          });
          chartData[key] = dv.rows;
        }
      });
      this.chartData = chartData;
      this.scale = scale;
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
    queryByHash (hash, successCb) {
      neb.api.getTransactionReceipt({hash}).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 0) {
          this.$message.error(receipt.execute_error);
          this.loading.close();
          clearInterval(this.timer);
        }
        if (receipt.status === 2) {
          // this.loading = Loading.service({ fullscreen: true });
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

 .question-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.question-left, .question-right {
  width: 50%;
}

.question-right .progress{
  display: flex;
  justify-content: flex-end;
}

.progress-bar {
  width: 60%;
}
</style>