<template>
    <el-table
        :data="questionList"
        style="width: 100%">
        <el-table-column
            prop="title"
            label="标题"
            width="180">
        </el-table-column>
        <el-table-column
            prop="time"
            label="截止时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="stateTitle"
            label="状态">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看问卷</el-button>
            <el-button @click="viewData(scope.row)" type="text" size="small">查看数据</el-button>
          </template>
        </el-table-column>
    </el-table>
</template>

<script>
import Nebulas from 'nebulas';
import { Loading } from 'element-ui';
import moment from 'moment';
import storage from '../../utils/storage';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

export default {
  data () {
    return {
      questionList: [],
      net: 'https://mainnet.nebulas.io',
      dappAddress: 'n1gGz8QkZevfryw2Z3sD48t6xzYThTZgFpC'
    };
  },
  created () {
    this.switchNet(this.net);
    this.getQuestionList();
  },
  mounted () {
  },
  methods: {
    getList () {
      if (storage.get().length) {
        this.questionList = storage.get();
        this.questionList.forEach(item => {
          let [year, month, day] = item.time.split('-');
          if (year < new Date().getFullYear()) {
            item.state = 'issueed';
            item.stateTitle = '已发布';
          } else if (year === new Date().getFullYear() && month < new Date().getMonth() + 1) {
            item.state = 'issueed';
            item.stateTitle = '已发布';
          } else if (year === new Date().getFullYear() && month === new Date().getMonth() + 1 && day < new Date().getDate()) {
            item.state = 'issueed';
            item.stateTitle = '已发布';
          }
        });
      } else {
        storage.save([
          { 'num': 1,
            'title': '第一份问卷',
            'time': '2030-1-1',
            'state': 'inissue',
            'stateTitle': '发布中',
            'checked': false,
            'question': [
              {'num': 'Q1', 'title': '单选题', 'type': 'radio', 'isNeed': true, 'options': ['选项一', '选项二']},
              {'num': 'Q2', 'title': '多选题', 'type': 'checkbox', 'isNeed': true, 'options': ['选项一', '选项二', '选项三', '选项四']},
              {'num': 'Q3', 'title': '文本题', 'type': 'textarea', 'isNeed': true}
            ]
          },
          { 'num': 2,
            'title': '第二份问卷',
            'time': '2030-1-1',
            'state': 'noissue',
            'stateTitle': '未发布',
            'checked': false,
            'question': [
              {'num': 'Q1', 'title': '单选题', 'type': 'radio', 'isNeed': true, 'options': ['选项一', '选项二']},
              {'num': 'Q2', 'title': '多选题', 'type': 'checkbox', 'isNeed': true, 'options': ['选项一', '选项二', '选项三', '选项四']},
              {'num': 'Q3', 'title': '文本题', 'type': 'textarea', 'isNeed': true}
            ]
          },
          { 'num': 3,
            'title': '第三份问卷',
            'time': '2017-3-27',
            'state': 'issueed',
            'stateTitle': '已发布',
            'checked': false,
            'question': [
              {'num': 'Q1', 'title': '单选题', 'type': 'radio', 'isNeed': true, 'options': ['选项一', '选项二']},
              {'num': 'Q2', 'title': '多选题', 'type': 'checkbox', 'isNeed': true, 'options': ['选项一', '选项二', '选项三', '选项四']},
              {'num': 'Q3', 'title': '文本题', 'type': 'textarea', 'isNeed': true}
            ]
          }
        ]);
        this.questionList = storage.get();
      }
    },
    handleClick (row) {
      this.$router.push({
        path: `/question/detail/${row.id}`
      });
    },
    viewData (row) {
      this.$router.push({
        path: `/question/data/${row.id}`
      });
    },
    switchNet (value) {
      neb.setRequest(new Nebulas.HttpRequest(value));
    },
    getQuestionList () {
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
      this.loading = Loading.service({ fullscreen: true });
      neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
        this.loading.close();
        let result = res.result;
        if (result === 'null') {
          this.result = [];
          return;
        }
        result = JSON.parse(result);
        this.questionList = result.map(item => ({
          ...item,
          stateTitle: item.state === 'inissue' ? '发布中' : '未发布',
          time: moment(item.date).format('YYYY-MM-DD')
        }));
      }).catch(err => console.log(`error:${err}`));
    }
  }
};
</script>

<style>

</style>
