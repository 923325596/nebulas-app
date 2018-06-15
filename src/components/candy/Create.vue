<template>
  <div class="create-content">
    <div class="loading" v-if="pending">
       <mu-circular-progress :size="90" />
    </div>
    <mu-alert color="success" delete :show.sync="topPopup" transition="mu-scale-transition" class="alert">
        <mu-icon value="check_circle"></mu-icon> 更新成功
    </mu-alert>
    <mu-alert color="error" delete :show.sync="toast" class="mu-alert">
      <mu-icon value="warning"></mu-icon> {{message}}
    </mu-alert>
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
            <mu-button raised class="demo-raised-button" color="primary" @click="handleSubmit">提交</mu-button>
          </mu-card-actions>
          <el-upload
            style="display:none"
            :action="qnLocation"
            :before-upload="beforeUpload"
            :data="uploadData"
            :on-success="upScuccess"
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
import * as Quill from 'quill';

import { isPC } from '../../utils/utils';

const neb = new Nebulas.Neb();
const nebPay = new NebPay();
const STATICDOMAIN = 'http://o9qn9041y.bkt.clouddn.com/';

export default {
  data () {
    return {
      hasExtension: false,
      title: '',
      dappAddress: 'n1yvgpF2cSsHnBP4j2jQNgSZtSmhJASPZ75',
      errorText: '',
      net: 'https://mainnet.nebulas.io',
      content: '',
      uploadData: {},
      editorOption: {
        placeholder: '详细信息..',
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
      },
      message: '',
      toast: false,
      pending: false,
      topPopup: false
    };
  },
  created () {
    this.init();
    this.switchNet(this.net);
  },
  mounted () {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
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
    onEditorBlur (editor) {
      console.log('editor blur!', editor);
    },
    onEditorFocus (editor) {
      console.log('editor focus!', editor);
    },
    onEditorReady (editor) {
      console.log('editor ready!', editor);
    },
    beforeUpload (file) {
      return this.qnUpload(file);
    },
    handleSubmit () {
      const value = '0';
      const callFunc = 'save';
      const callArgs = JSON.stringify([this.title, this.content]);
      this.nebPayCall(callFunc, callArgs, value, () => {
        this.pending = true;
      }, () => {
        this.pending = false;
        this.topPopup = true;
        this.title = '';
        this.content = '';
        setTimeout(() => {
          this.topPopup = false;
        }, 2000);
      });
    },

    // 图片上传前获得数据token数据
    qnUpload (file) {
      this.fullscreenLoading = true;
      if (this.uploadType === 'image') { // 如果是点击插入图片
        // TODO 图片格式/大小限制
        axios.get('http://118.24.54.139:9000/api/uptoken')
          .then((res) => {
            const token = res.data.uptoken;
            let config = {
              useCdnDomain: true,
              region: null
            };
            let putExtra = {
              fname: '',
              params: {},
              mimeType: null
            };
            console.log(token);
            let observable = qiniu.upload(file, file.name, token, putExtra, config);
            const next = (response) => {
              let total = response.total;
              console.log(total);
            };
            const error = (err) => {
              console.log(err);
            };
            const complete = (res) => {
              this.upScuccess(res);
            };
            observable.subscribe(next, error, complete);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    // 图片上传成功回调   插入到编辑器中
    upScuccess (res) {
      this.fullscreenLoading = false;
      let vm = this;
      let url = '';
      if (this.uploadType === 'image') { // 获得文件上传后的URL地址
        url = STATICDOMAIN + res.key;
      }
      if (url !== null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
        const quill = this.$refs.myTextEditor.quill;
        let selection = quill.getSelection();
        let value = url.indexOf('http') !== -1 ? url : 'http:' + url;
        let index = selection !== null ? selection.index : 0;
        quill.insertEmbed(index, 'image', value, Quill.sources.USER);
        quill.setSelection(index + 1, 0);
      } else {
        this.showToast();
        this.message = `${vm.uploadType}插入失败`;
      }
      this.$refs['upload'].clearFiles(); // 插入成功后清除input的内容
    },
    imgHandler (state) {
      this.addRange = this.$refs.myTextEditor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById('imgInput');
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = 'image';
    },
    showToast () {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = false; }, 2000);
    },
    queryByHash (hash, successCb) {
      neb.api.getTransactionReceipt({hash}).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 0) {
          this.message = receipt.execute_error;
          this.pending = false;
          clearInterval(this.timer);
        }
        if (receipt.status === 2) {
          this.pending = true;
        }
        if (receipt.status === 1) {
          this.pending = false;
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
  },
  computed: {
    editor () {
      return this.$refs.myTextEditor.quill;
    },
    contentCode () {
      return hljs.highlightAuto(this.content).value;
    },
    qnLocation () {
      return location.protocol === 'http:' ? 'http://upload.qiniu.com' : 'https://up.qbox.me';
    }
  }
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
