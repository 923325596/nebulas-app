<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="问卷标题">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addQuestion">添加问题</el-button>
        </el-form-item>
        <el-form-item label="问题类型" v-if="addStatus">
          <el-checkbox-group v-model="questionType">
            <el-checkbox-button label="单选" name="type"></el-checkbox-button>
            <el-checkbox-button label="多选" name="type"></el-checkbox-button>
            <el-checkbox-button label="文本框" name="type"></el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="截止日期">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        addStatus: false
      }
    };
  },
  methods: {
    onSubmit () {
      console.log('submit!');
    },
    addQuestion () {
      this.addStatus = true;
    }
  }
};
</script>

<style>

</style>
