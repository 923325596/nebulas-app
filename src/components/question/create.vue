<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="问卷标题">
        <el-input v-model="questionItem.title"></el-input>
    </el-form-item>
    <div class="content">
      <div class="question" v-for="(question, index) in questionItem.question" :key="index">
        <div class="question-row">
          <div class="question-left">
            <p>
              {{question.num}}&nbsp;{{question.title}}&nbsp;{{typeObj[question.type]}}
            </p>
            <el-radio label="1" v-for="option in question.options" v-if="question.type === 'radio'" :key="option">
              {{option}}
            </el-radio>
            <el-checkbox v-for="option in question.options" v-if="question.type === 'checkbox'" :key="option">
              {{option}}
            </el-checkbox>
            <el-input
              type="textarea"
              v-if="question.type === 'textarea'"
            >
            </el-input>
          </div>
          <div class="question-right">
            <el-button type="primary" icon="el-icon-delete" @click="deleteItem(index)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-form-item>
        <el-button type="primary" @click="addQuestion">添加问题</el-button>
    </el-form-item>
    <el-form-item label="问题类型" v-if="addStatus">
      <el-button type="primary" round @click="handleClickType('radio')">单选</el-button>
      <el-button type="primary" round @click="handleClickType('checkbox')">多选</el-button>
      <el-button type="primary" round @click="handleClickType('textarea')">文本框</el-button>
    </el-form-item>
    <el-form-item label="截止日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="date" style="width: 100%;"></el-date-picker>
        </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="publish">发布问卷</el-button>
    </el-form-item>
    <el-dialog title="问题" :visible.sync="modalVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="题目标题">
          <el-input v-model="questionTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目选项" v-if="showOption">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="多个选项用半角逗号','分隔开"
            v-model="questionOptions">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateQuestion">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import storage from '../../utils/storage';
import { isPC } from '../../utils/utils';

const neb = new Nebulas.Neb();
const nebPay = new NebPay();
export default {
  data () {
    return {
      title: '',
      date: '',
      questionItem: {},
      questionList: storage.get(),
      addStatus: false,
      questionType: '',
      modalVisible: false,
      questionTitle: '',
      questionOptions: '',
      showOption: true,
      form: {},
      typeObj: {
        radio: '单选',
        checkbox: '多选',
        textarea: '文本框'
      },
      dappAddress: 'n1gGz8QkZevfryw2Z3sD48t6xzYThTZgFpC',
      net: 'https://mainnet.nebulas.io'
    };
  },
  watch: {
    questionType (newVal, oldVal) {
      this.modalVisible = true;
      if (newVal === '文本框') {
        this.showOption = false;
      }
    },
    questionItem: {
      handler (newVal) {
        newVal.question.forEach((item, index) => {
          item.num = `Q${index + 1}`;
        });
      },
      deep: true
    }
  },
  created () {
    this.fetchData();
    this.switchNet(this.net);
  },
  methods: {
    switchNet (value) {
      neb.setRequest(new Nebulas.HttpRequest(value));
    },
    fetchData () {
      let item = {};
      item.num = this.questionList.length + 1;
      item.title = '';
      item.time = '';
      item.state = 'noissue';
      item.question = [];
      item.stateTitle = '未发布';
      item.checked = false;
      this.questionItem = item;
      this.questionList.push(this.questionItem);
    },
    onSubmit () {
      console.log('submit!');
    },
    addQuestion () {
      this.addStatus = true;
    },
    validateQuestion () {
      let questionTitle = this.questionTitle.trim();
      if (questionTitle === '') return this.$message.error('题目不能为空');
      if (this.showOption) {
        let questionOptions = this.questionOptions.trim();
        if (questionOptions === '') return this.$message.error('选项不能为空！');
        questionOptions = questionOptions.split(',');
        for (let i = 0, length = questionOptions.length; i < length; i++) {
          if (questionOptions[i].trim() === '') {
            return this.$message.error('存在某个选项内容为空');
          }
        };
        this.questionItem.question.push({
          'num': this.questionItem.question.length - 1,
          'title': questionTitle,
          'type': this.questionType,
          'isNeed': true,
          'options': questionOptions
        });
        this.modalVisible = false;
      } else {
        this.questionItem.question.push({
          'num': this.questionItem.question.length - 1,
          'title': questionTitle,
          'type': this.questionType,
          'isNeed': true
        });
        this.modalVisible = false;
      }
    },
    handleClickType (type) {
      this.questionType = type;
      this.modalVisible = true;
      if (type === 'textarea') {
        this.showOption = false;
      }
    },
    deleteItem (index) {
      this.questionItem.question.splice(index, 1);
    },
    save () {
      this.questionItem.time = this.date;
      if (this.questionItem.question.length === 0) {
        alert('问卷为空无法保存');
      } else {
        storage.save(this.questionList);
      }
    },
    publish () {
      this.questionItem.time = this.date;
      if (this.questionItem.title === '') {
        return this.$message.error('标题为空无法保存');
      }
      if (this.questionItem.question.length === 0) {
        return this.$message.error('问卷为空无法保存');
      } else {
        this.questionItem.state = 'inissue';
        this.questionItem.stateTitle = '发布中';
        storage.save(this.questionList);
        const value = '0';
        const callFunc = 'create';
        const callArgs = JSON.stringify([this.questionItem.title, this.date, 'inissue', this.questionItem.question]);
        this.nebPayCall(callFunc, callArgs, value, () => {
          this.loading = this.$loading({
            fullscreen: true,
            text: '正在查询交易，请等待'
          });
        }, () => {
          this.loading.close();
          this.title = '';
          this.$message({
            message: '新建问卷成功',
            type: 'success'
          });
          this.$router.push({path: '/question/list'});
        });
      }
    },
    queryByHash (hash, successCb) {
      neb.api.getTransactionReceipt({hash}).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 0) {
          this.message = receipt.execute_error;
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
  .question {
    margin-bottom: 20px;
  }
  .content {
    padding-left: 80px;
  }
  .question-row {
    display: flex;
    justify-content: space-between;
  }
  .question-left {
    width: 50%;
  }
</style>
