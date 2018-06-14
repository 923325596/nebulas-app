<template>
  <div class="create-content">
    <div class="form">
      <mu-card>
        <mu-card-header title="提交糖果信息" >
        </mu-card-header>
        <div class="card-content">
          <div class="line">
            <mu-text-field
            v-model="title"
            :disabled="!hasExtension"
            placeholder="标题"
            :error-text="title ? '' : errorText"
            :max-length="30"/>
          </div>
          <mu-card-media>
            <div class="quill-editor">
              <quill-editor
                ref="myTextEditor"
                v-model="content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
              </quill-editor>
            </div>
          </mu-card-media>
          
          <mu-card-actions>
            <mu-button raised class="demo-raised-button" color="primary" @click="add">提交</mu-button>
          </mu-card-actions>
          <el-upload
            style="display:none"
            :action="qnLocation" 
            :before-upload='beforeUpload' 
            :data="uploadData" 
            :on-success='upScuccess' 
            ref="upload">
            <el-button size="small" type="primary" id="imgInput">点击上传</el-button>
          </el-upload>
        </div>
      </mu-card>
      <div class="extension" v-if="!hasExtension">
        检测到你尚未安装星云钱包<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
      </div>
    </div>
  </div>
</template>

<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import hljs from 'highlight.js';
import * as qiniu from 'qiniu-js';
import axios from 'axios';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();

export default {
  data () {
    return {
      hasExtension: false,
      title: '',
      description: '',
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      content: `<span class="ql-font-serif">详细信息..</span>`,
      uploadData: {},
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image']
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
  },
  methods: {
    init () {
      try {
        if (typeof (webExtensionWallet) !== 'undefined') {
          this.hasExtension = true;
        } else {
          throw new Error('Extension wallet is not installed, please install it first.');
        }
      } catch (e) {
        this.hasExtension = false;
        console.log(e);
      }
    },
    switchNet (value) {
      neb.setRequest(new Nebulas.HttpRequest(value));
    },
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    beforeUpload(file) {
      return this.qnUpload(file)
    },
    add () {
      console.log(111);
    },

    // 图片上传前获得数据token数据
    qnUpload (file) {
      this.fullscreenLoading = true
      const suffix = file.name.split('.')
      const ext = suffix.splice(suffix.length - 1, 1)[0]
      if (this.uploadType === 'image') { // 如果是点击插入图片
        // TODO 图片格式/大小限制
        axios.get('http://118.24.54.139:9000/api/uptoken')
        .then(function (res) {
          const token = res.data.uptoken;
          let config = {
            useCdnDomain: true,
            region: null
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null
          };
          console.log(token);
          let observable = qiniu.upload(file, file.name, token, putExtra, config);
          const next = (response) =>{
            let total = response.total;
            console.log(total);
          }
          const error = (err) => {
            console.log(err);
          }
          const complete = (res) => {
            console.log(res);
          }
          let subscription = observable.subscribe(next, error, complete);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    // 图片上传成功回调   插入到编辑器中
    upScuccess(e, file, fileList) {
      console.log(e)
      this.fullscreenLoading = false
      let vm = this
      let url = ''
      if (this.uploadType === 'image') { // 获得文件上传后的URL地址
        url = STATICDOMAIN + e.key
      } else if (this.uploadType === 'video') {
        url = STATVIDEO + e.key
      }
      if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        // API: https://segmentfault.com/q/1010000008951906
        // this.$refs.myTextEditor.quillEditor.getSelection();
        // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
        vm.addRange = vm.$refs.myTextEditor.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.myTextEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$message.error(`${vm.uploadType}插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
    },
    imgHandler(state) {
      this.addRange = this.$refs.myTextEditor.quill.getSelection()
      if (state) {
        let fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    contentCode () {
      return hljs.highlightAuto(this.content).value;
    },
    qnLocation () {
      return location.protocol === 'http:' ? 'http://upload.qiniu.com' : 'https://up.qbox.me';
    }
  },
};
</script>

<style>
.create-content {
  background-color: white;
  min-height: 500px;
  padding: 50px;
}

.card-content {
  padding: 20px;
}

.ql-container {
  height: 500px;
}
</style>
