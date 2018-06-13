<template>
  <div class="body">
    <div class="app-row">
      <div class="left">
        <mu-card>
          <mu-card-header title="开始你的故事" >
          </mu-card-header>
          <div class="card-content">
            <mu-text-field
              v-model="value"
              multi-line
              :rows="3"
              :rows-max="6"
              :max-length="500"
              :disabled="!hasExtension"
              placeholder="输入故事开始"
              :error-text="value ? '' : errorText"/>
              <mu-card-actions>
                <mu-button raised class="demo-raised-button" color="primary" @click="add">提交</mu-button>
              </mu-card-actions>
          </div>
        </mu-card>
        <div class="extension" v-if="!hasExtension">
          检测到你尚未安装星云钱包<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>扩展，请先安装然后使用。
        </div>
      </div>
      <div class="right">
        <div class="list" v-if="list.length">
          <mu-paper :z-depth="1" class="demo-list-wrap">
            <mu-list>
              <mu-sub-header>故事列表</mu-sub-header>
              <mu-list-item
                avatar button :ripple="false"
                v-for="(item, index) in list"
                @click="getStoryDetail(index)"
                :key="index">
                <mu-list-item-action>
                  <mu-avatar color="pinkA200" :style="{'margin-left': '-8px'}" text-color="#FFF" slot="leftAvatar">
                    {{item.author.substr(-1, 1).toUpperCase()}}
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-title>{{item.content[0].content}}</mu-list-item-title>
              </mu-list-item>
            </mu-list>
          </mu-paper>
        </div>
      </div>
    </div>
    <div class="detail" v-if="detail.author">
      <mu-card>
        <mu-card-header title="故事详情" :subTitle="`Author:${detail.author}`">
          <mu-avatar
            color="pinkA200"
            :style="{'margin-left': '-8px'}"
            backgroundColor="transparent"
            slot="avatar">
            {{detail.author.substr(-1, 1).toUpperCase()}}
          </mu-avatar>
        </mu-card-header>
        <mu-card-text v-for="text in detail.content" :key="text.content">
          <span class="author">By:{{text.from}}</span>:{{text.content}}
        </mu-card-text>
        <div class="card-content">
          <mu-text-field
            v-model="writeVal"
            multi-line
            :rows="3"
            :rows-max="6"
            :max-length="500"
            :disabled="!hasExtension"
            placeholder="续写故事"
            :error-text="value ? '' : errorText"/>
            <mu-card-actions>
              <mu-button raised class="demo-raised-button" color="primary" @click="write">提交 </mu-button>
            </mu-card-actions>
        </div>
      </mu-card>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.body{
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
  padding: 50px;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left, .right {
  flex: 1;
}

.right {
  margin-left: 50px;
}

.content {
  padding-bottom:100px;
}

.footer{
  padding: 20px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgb(236, 236, 236);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail {
  margin-top: 20px;
}

.card-content {
  padding: 16px;
}

.mu-text-field {
  width: 100%;
}

.author {
  font-size: 14px;
  color: #666;
  margin-right: 5px;
}

.demo-list-wrap {
  width: 100%;
  max-width: 360px;
}

@media screen and (max-width: 768px) {
    .body {
       padding: 20px 20px 0 20px;
    }
    .app-row, .row {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .card {
      margin: 0 0 20px 0;
    }
    .left, .right {
      width: 100%;
    }
    .right {
      padding: 0px;
      margin-left: 0;
      margin-top: 20px;
    }
    .mu-card-sub-title {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
}
</style>
