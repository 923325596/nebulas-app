webpackJsonp([20],{"B2O/":function(t,e){},g1y4:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("3cXf"),n=i.n(s),o=i("jOGT"),a=i.n(o),l=i("+Mly"),r=i.n(l),u=i("VKKs"),c=i("oAV5"),h=new r.a.Neb,m=new a.a,d={data:function(){return{title:"",date:"",questionItem:{},questionList:u.a.get(),addStatus:!1,questionType:"",modalVisible:!1,questionTitle:"",questionOptions:"",showOption:!0,form:{},typeObj:{radio:"单选",checkbox:"多选",textarea:"文本框"},dappAddress:"n1gGz8QkZevfryw2Z3sD48t6xzYThTZgFpC",net:"https://mainnet.nebulas.io"}},watch:{questionType:function(t,e){this.modalVisible=!0,"文本框"===t&&(this.showOption=!1)},questionItem:{handler:function(t){t.question.forEach(function(t,e){t.num="Q"+(e+1)})},deep:!0}},created:function(){this.fetchData(),this.switchNet(this.net)},methods:{switchNet:function(t){h.setRequest(new r.a.HttpRequest(t))},fetchData:function(){var t={};t.num=this.questionList.length+1,t.title="",t.time="",t.state="noissue",t.question=[],t.stateTitle="未发布",t.checked=!1,this.questionItem=t,this.questionList.push(this.questionItem)},onSubmit:function(){console.log("submit!")},addQuestion:function(){this.addStatus=!0},validateQuestion:function(){var t=this.questionTitle.trim();if(""===t)return this.$message.error("题目不能为空");if(this.showOption){var e=this.questionOptions.trim();if(""===e)return this.$message.error("选项不能为空！");for(var i=0,s=(e=e.split(",")).length;i<s;i++)if(""===e[i].trim())return this.$message.error("存在某个选项内容为空");this.questionItem.question.push({num:this.questionItem.question.length-1,title:t,type:this.questionType,isNeed:!0,options:e}),this.modalVisible=!1}else this.questionItem.question.push({num:this.questionItem.question.length-1,title:t,type:this.questionType,isNeed:!0}),this.modalVisible=!1},handleClickType:function(t){this.questionType=t,this.modalVisible=!0,"textarea"===t&&(this.showOption=!1)},deleteItem:function(t){this.questionItem.question.splice(t,1)},save:function(){this.questionItem.time=this.date,0===this.questionItem.question.length?alert("问卷为空无法保存"):u.a.save(this.questionList)},publish:function(){var t=this;if(this.questionItem.time=this.date,""===this.questionItem.title)return this.$message.error("标题为空无法保存");if(0===this.questionItem.question.length)return this.$message.error("问卷为空无法保存");this.questionItem.state="inissue",this.questionItem.stateTitle="发布中",u.a.save(this.questionList);var e=n()([this.questionItem.title,this.date,"inissue",this.questionItem.question]);this.nebPayCall("create",e,"0",function(){t.loading=t.$loading({fullscreen:!0,text:"正在查询交易，请等待"})},function(){t.loading.close(),t.title="",t.$message({message:"新建问卷成功",type:"success"}),t.$router.push({path:"/question/list"})})},queryByHash:function(t,e){var i=this;h.api.getTransactionReceipt({hash:t}).then(function(t){console.log(t),0===t.status&&(i.message=t.execute_error,i.$message.error(t.execute_error),i.loading.close(),clearInterval(i.timer)),2===t.status&&(i.loading=i.$loading({fullscreen:!0,text:"正在查询交易，请等待"})),1===t.status&&(i.loading.close(),console.error("clear",i.timer),clearInterval(i.timer),i.timer=null,e(t))})},nebPayCall:function(t,e,i,s,n){var o=this;if(this.serialNumber=m.call(this.dappAddress,i,t,e,{listener:function(t){if(Object(c.b)()&&t.txhash){var e=t.txhash;o.timer=setInterval(function(){o.queryByHash(e,n),console.error("timer",o.timer)},5e3)}}}),!Object(c.b)())var a=setInterval(function(){o.queryInterval(function(t){clearInterval(a),s(t.hash),o.timer=setInterval(function(){console.error("timer",o.timer),o.queryByHash(t.hash,n)},5e3)})},3e3)},queryInterval:function(t){m.queryPayInfo(this.serialNumber).then(function(e){console.log("tx result: "+e);var i=JSON.parse(e);console.log(i),"success"===i.msg&&t&&t(i.data)}).catch(function(t){console.log("err",t)})}}},p={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("el-form",{ref:"form",attrs:{model:t.form,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"问卷标题"}},[i("el-input",{model:{value:t.questionItem.title,callback:function(e){t.$set(t.questionItem,"title",e)},expression:"questionItem.title"}})],1),t._v(" "),i("div",{staticClass:"content"},t._l(t.questionItem.question,function(e,s){return i("div",{key:s,staticClass:"question"},[i("div",{staticClass:"question-row"},[i("div",{staticClass:"question-left"},[i("p",[t._v("\n            "+t._s(e.num)+"、"+t._s(e.title)+"\n            "),i("span",{staticClass:"question-type"},[t._v("\n              ["+t._s(t.typeObj[e.type])+"]\n            ")])]),t._v(" "),t._l(e.options,function(s){return"radio"===e.type?i("el-radio",{key:s,attrs:{label:"1"}},[t._v("\n            "+t._s(s)+"\n          ")]):t._e()}),t._v(" "),t._l(e.options,function(s){return"checkbox"===e.type?i("el-checkbox",{key:s},[t._v("\n            "+t._s(s)+"\n          ")]):t._e()}),t._v(" "),"textarea"===e.type?i("el-input",{attrs:{type:"textarea"}}):t._e()],2),t._v(" "),i("div",{staticClass:"question-right"},[i("el-button",{attrs:{type:"primary",icon:"el-icon-delete"},on:{click:function(e){t.deleteItem(s)}}},[t._v("删除")])],1)])])})),t._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:t.addQuestion}},[t._v("添加问题")])],1),t._v(" "),t.addStatus?i("el-form-item",{attrs:{label:"问题类型"}},[i("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){t.handleClickType("radio")}}},[t._v("单选")]),t._v(" "),i("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){t.handleClickType("checkbox")}}},[t._v("多选")]),t._v(" "),i("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){t.handleClickType("textarea")}}},[t._v("文本框")])],1):t._e(),t._v(" "),i("el-form-item",{attrs:{label:"截止日期"}},[i("el-col",{attrs:{span:11}},[i("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"date",placeholder:"选择日期"},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}})],1)],1),t._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:t.publish}},[t._v("发布问卷")])],1),t._v(" "),i("el-dialog",{attrs:{title:"问题",visible:t.modalVisible},on:{"update:visible":function(e){t.modalVisible=e}}},[i("el-form",{attrs:{model:t.form,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"题目标题"}},[i("el-input",{attrs:{"auto-complete":"off"},model:{value:t.questionTitle,callback:function(e){t.questionTitle=e},expression:"questionTitle"}})],1),t._v(" "),t.showOption?i("el-form-item",{attrs:{label:"题目选项"}},[i("el-input",{attrs:{type:"textarea",rows:2,placeholder:"多个选项用半角逗号','分隔开"},model:{value:t.questionOptions,callback:function(e){t.questionOptions=e},expression:"questionOptions"}})],1):t._e()],1),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.modalVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.validateQuestion}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var f=i("vSla")(d,p,!1,function(t){i("B2O/")},"data-v-2b805c32",null);e.default=f.exports}});
//# sourceMappingURL=20.f72354b25eae5798d34f.js.map