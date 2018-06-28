<template>
  <el-tabs type="border-card">
    <el-tab-pane label="统计图表">
       <div class="content" v-if="questionDetail">
          <div class="question-title">{{questionDetail.title}}</div>
          <div class="question" v-for="(question, index) in questionDetail.question" :key="index">
            <div class="question-row">
                <div class="question-answer">
                  <p>
                    {{question.num}}、{{question.title}}
                    <span class="question-type">[{{typeObj[question.type]}}]</span>
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
                  <div class="el-textarea">
                    <el-input
                      type="textarea"
                      v-if="question.type === 'textarea'"
                      v-model="formItem[question.num]"
                    >
                    </el-input>
                  </div>
                </div>
                <div class="question-detail" v-if="chartData[question.num]">
                  <div class="question-chart">
                    <v-chart :forceFit="true" :padding="[50, 80, 80, 110]" :height="height" :data="chartData[question.num]" :scale="scale" v-if="!chartData[question.num].type && scale">
                      <v-tooltip :showTitle="false" dataKey="item*percent" />
                      <v-axis />
                      <v-legend dataKey="item" />
                      <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
                      <v-coord type="theta" />
                    </v-chart>
                    <div class="progress" v-if="question.type === 'textarea'">
                      <p>有效回答占比:</p>
                      <el-progress class="progress-bar" :text-inside="true" :stroke-width="18" :percentage="chartData[question.num].percent"></el-progress>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="样本数据">
      <div class="content" v-if="questionDetail">
          <div class="question-title">{{questionDetail.title}}</div>
          <el-table
            :data="questionDetail.answers"
            style="width: 100%">
            <el-table-column
              label="查看"
              width="100">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-view"
                  circle
                  size="mini"
                  @click="handleView(scope.$index, scope.row)">
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="author"
              label="调查者">
            </el-table-column>
            <el-table-column
              v-for="(item, index) in questionDetail.question"
              :key="item.num"
              :label="`${index + 1}、${item.title}`"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.data[item.num] }}</span>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
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
      height: 400,
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
            chartData[key].percent = (chartData[key].valid * 100 / chartData[key].all).toFixed(2);
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
    handleView (index, record) {
      console.log(index, record);
      this.$router.push({
        path: `/question/detail/${this.questionDetail.id}`,
        query: { record: record }
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
  font-size: 16px;
  margin-bottom: 20px;
}

.question-row {
  /* display: flex;
  justify-content: space-between;
  align-items: center; */
}
.question-left, .question-right {
  /* width: 50%; */
}

.question-detail {
  text-align: left;
  padding: 20px;
}

.progress-bar {
  width: 100%;
}

.question-title {
  font-size: 20px;
  color: #333;
}

.question-type {
  color: #409EFF;
  font-size: 14px;
}

.el-textarea {
  width: 414px;
}

.question-chart {
  width: 500px;
}
</style>
