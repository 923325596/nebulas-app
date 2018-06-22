<template>
  <div class="content" v-if="questionDetail">
    <h2>{{questionDetail.title}}</h2>
    <div class="question" v-for="(question, index) in questionDetail.question" :key="index">
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
  </div>
</template>

<script>
import storage from '../../utils/storage';
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
      type: []
    };
  },
  mounted () {
    this.getRequiredItem();
  },
  created () {
    // this.switchNet(this.net);
    // this.getQuestionDetail();
    this.fetchData();
  },
  methods: {
    getQuestionDetail () {
      const id = this.$route.params.id;
      this.id = id;
      this.questionDetail = this.questionList.find(item => item.num === +id);
      this.questionDetail.question.forEach(item => {
        if (item.type === 'checkbox') {
          this.formItem[item.num] = [];
        }
      });
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
        if (item.isNeed) {
          if (item.isNeed) {
            if (item.type === 'checkbox') {
              this.formItem[item.num] = [];
            } else {
              this.formItem[item.num] = '';
            }
          }
        }
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
