<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="问卷标题">
        <el-input v-model="title"></el-input>
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
      <el-button type="primary" @click="publish">发表问卷</el-button>
      <el-button @click="save">保存问卷</el-button>
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
import storage from '../../utils/storage';
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
      }
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
  },
  methods: {
    fetchData () {
      let item = {};
      item.num = this.questionList.length + 1;
      item.title = '这里是标题';
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
      if (questionTitle === '') return alert('题目不能为空');
      if (this.showOption) {
        let questionOptions = this.questionOptions.trim();
        if (questionOptions === '') return alert('选项不能为空！');
        questionOptions = questionOptions.split(',');
        for (let i = 0, length = questionOptions.length; i < length; i++) {
          if (questionOptions[i].trim() === '') {
            return alert('存在某个选项内容为空');
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
      if (this.questionItem.question.length === 0) {
        alert('问卷为空无法保存');
      } else {
        this.questionItem.state = 'inissue';
        this.questionItem.stateTitle = '发布中';
        storage.save(this.questionList);
        this.$router.push({path: '/'});
      }
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
