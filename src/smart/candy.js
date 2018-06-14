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
    this.date = obj.date;
    this.outdate = obj.date;
  } else {
    this.title = '';
    this.description = '';
    this.author = '';
    this.agree = '';
    this.agree = [];
    this.disagree = [];
    this.comments = [];
    this.id = '';
    this.date = '';
    this.outdate = false;
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
    var d = new Date();
    item.date = d.toString();
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

  len: function () {
    return this.id;
  },

  outdate: function (title) {
    var item = this.candylist.get(title);
    item.outdate = true;
    this.candylist.put(title, item);
  },

  query: function (page) {
    var size = page * 10;
    if (size > this.id) {
      size = this.id;
    }
    var result = [];
    var start = (page - 1) * 10;
    for (var i = start; i < size; i++) {
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

// n21D6DRiD7UtBBUMiWEUydXJFQyMe88HYNV
// 8f25c6c0e912760c0693f100f357acb4330298aa0d181a46804f821722a8c6a7