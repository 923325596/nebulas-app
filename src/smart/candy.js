'use strict';

var Candy = function (candy) {
  if (candy) {
    var obj = JSON.parse(candy);
    this.title = obj.title;
    this.description = obj.description;
    this.author = obj.author;
    this.agree = obj.agree;
    this.disagree = obj.disagree;
    this.comments = obj.comments;
    this.id = obj.id;
  } else {
    this.title = '';
    this.description = '';
    this.author = '';
    this.agree = '';
    this.agree = [];
    this.disagree = [];
    this.comments = [];
    this.id = '';
  }
};

Candy.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var CandyList = function () {
  LocalContractStorage.defineMapProperty(this, 'candylist', {
    parse: function (candy) {
      return new Candy(candy);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'candyMap');
  LocalContractStorage.defineProperty(this, 'id');
};

CandyList.prototype = {
  init: function () {
    this.id = 0;
  },

  save: function (title, description, platform) {
    var from = Blockchain.transaction.from;
    var item = this.candylist.get(title);
    if (item) {
      throw new Error('已经存在这条记录了！');
    }

    item = new Candy();
    item.id = this.id;
    item.author = from;
    item.title = title;
    item.description = description;
    this.candyMap.set(this.id, title);

    this.candylist.put(title, item);
    this.id += 1;
  },

  get: function (title) {
    return this.candylist.get(title);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      var title = this.candyMap.get(i);
      result[i] = this.candylist.get(title);
    }
    return result;
  },

  query: function (page) {
    var result = [];
    var start = (page - 1) * 10;
    for (var i = start; i < 10; i++) {
      var title = this.candyMap.get(i);
      result[i] = this.candylist.get(title);
    }
    return result;
  },

  toggleAgree: function (title, isAgree) {
    var from = Blockchain.transaction.from;
    var item = this.candylist.get(title);
    var agreeArr = item.agree;
    var disagreeArr = item.disagree;
    var agreeIndex;
    var disagreeIndex;
    agreeIndex = agreeArr.indexOf(from);
    disagreeIndex = disagreeArr.indexOf(from);
    if (isAgree) {
      if (disagreeIndex !== -1) {
        disagreeArr.splice(disagreeIndex, 1);
      }
      if (agreeIndex !== -1) {
        throw new Error('每人只能点赞一次喔！');
      }
      agreeArr.push(from);
    } else {
      if (agreeIndex !== -1) {
        agreeArr.splice(agreeIndex, 1);
      }
      if (disagreeIndex !== -1) {
        throw new Error('每人只能反对一次喔！');
      }
      disagreeArr.push(from);
    }
    item.agree = agreeArr;
    item.disagree = disagreeArr;

    this.candylist.put(title, item);
  },

  comment: function (title, data) {
    var from = Blockchain.transaction.from;
    var item = this.candylist.get(title);
    var comment = data;
    comment.author = from;
    var comments = item.comments;
    comments.push(comment);
    item.comments = comments;
    this.candylist.put(title, item);
  }
};

module.exports = CandyList;
