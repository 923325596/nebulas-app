<template>
  <div class="layout">
    <mu-toast v-if="toast" :message="message" @close="hideToast"/>
    <div class="header">
      <div class="title">
        天眼
      </div>
      <div class="logo">
        <img src="../assets/nebulasx60.png" alt="">
      </div>
    </div>
    <div class="content">
      <div class="body">
        <div class="left">
          <div class="row">
            <mu-text-field v-model="value" hintText="输入你想查找的企业"/>
            <mu-raised-button label="搜索" class="demo-raised-button" primary @click="search"/>
          </div>

          <div class="no-result" v-if="result">
            <div class="row">
              <span>
                输入的企业没有记录！
              </span>
              <mu-raised-button label="添加" class="demo-raised-button" primary @click="add"/>
            </div>
            <div class="row" v-if="visible">
              <mu-text-field v-model="addValue" hintText="描述企业信息" multiLine :rows="3" :rowsMax="6"/>
              <mu-raised-button label="提交" class="demo-raised-button" primary @click="submit"/>
            </div>
          </div>
        </div>
        <div class="right">

        </div>
      </div>
    </div>
    <div class="footer">
      Muse-UI ©2017 Created by Muse-UI
    </div>

  </div>
</template>
<script>
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();
const dappAddress = 'n1utupNggY4GV4JynFX45kURgtSCv5xhpek';
// cd $GOPATH/src/github.com/nebulasio/go-nebulas
// ./neb -c conf/default/config.conf

export default {
  data () {
    return {
      value: '',
      addValue: '',
      result: true,
      message: '',
      toast: false,
      visible: false,
    }
  },
  created() {
    this.checkNebpay();
    this.switchNet();
  },
  methods: {
    checkNebpay() {
      console.log("check nebpay")
      try{
          console.log(NebPay);

      }catch(e){
          console.log("Extension wallet is not installed, please install it first.")
          
      }
    },
    switchNet() {
      // neb.setRequest(new Nebulas.HttpRequest("localhost:8685"));
      neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
    },
    search() {
      const from = Account.NewAccount().getAddressString();
      const value = "0";
      const nonce = "0";
      const gas_price = "1000000";
      const gas_limit = "2000000";
      const callFunc = "get";
      const callArgs = JSON.stringify([this.value]);
      const contract = {
        function: callFunc,
        args: callArgs,
      }
      neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        this.afterSearch(res)
      }).catch(err => console.log("error:" + err))
    },
    afterSearch(res) {
      console.log(res);
      let result = res.result;
      if (result === 'null') {
        this.showToast(result.execute_err);
      }
      // result = JSON.parse(result);
      // if (!!result.key) {
      //   this.result = result;
      // } else {
      //   this.result = null;
      // }
    },
    add() {
      this.visible = true;
    },
    submit() {
      const to = dappAddress;
      const value = "0";
      const callFunc = "save";
      const callArgs = JSON.stringify([this.value, this.add]);
      
      this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
        listener: this.cbPush
      })

      this.timer = setInterval(() => {
        this.queryInterval();
      }, 5000);
    },
    cbPush(res) {
      console.log('res of push:'+JSON.stringify(res));
    },
    queryInterval() {
      nebPay.queryPayInfo(this.serialNumber)
        .then(res => {
          console.log("tx result: "+ res);
          const resObj = JSON.parse(res);
          if(resObj.code === 0) {
            alert(`set ${this.value} succeed!`);
            clearInterval(this.timer);
          }
        })
    },
    showToast (message) {
      this.toast = true
      this.message = message
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
    },
    hideToast () {
      this.toast = false
      if (this.toastTimer) clearTimeout(this.toastTimer)
    }
  },
}
</script>
<style scoped>
.layout{
  background-color: rgb(236, 236, 236);
}

.header{
  background-color: #7e57c2;
}

.title{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.logo {
  display: inline-block;
  vertical-align: middle;
}

.logo img {
  width: 145px;
  height: 35px;
}

.nav{
  display: inline-block;
  width: calc(100% - 150px);
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0);
}

.content{
  width: 100%;
  margin: 0 auto;
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
  padding: 50px;
  display: flex;
}

.left, .right {
  flex: 1;
}

.footer{
  padding: 20px 0;
  text-align: center;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
