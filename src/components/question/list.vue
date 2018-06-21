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
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看问卷</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看数据</el-button>
          </template>
        </el-table-column>
    </el-table>
</template>

<script>
import storage from '../../utils/storage';
export default {
  data () {
    return {
      questionList: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    };
  },
  mounted () {
    if (storage.get() !== null) {
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
  methods: {
    handleClick (row) {
      console.log(row);
    }
  }
};
</script>

<style>

</style>
