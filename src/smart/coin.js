'use strict';

var Coin = function (coin) {
  if (coin) {
    var obj = JSON.parse(coin);
    this.name = obj.name;
    this.reason = obj.reason;
    this.platform = obj.platform;
    this.author = obj.author;
    this.agree = obj.agree;
    this.disagree = obj.disagree;
    this.comments = obj.comments;
    this.id = obj.id;
  } else {
    this.name = '';
    this.reason = '';
    this.platform = '';
    this.author = '';
    this.agree = '';
    this.agree = [];
    this.disagree = [];
    this.comments = [];
    this.id = '';
  }
};

Coin.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var CoinList = function () {
  LocalContractStorage.defineMapProperty(this, 'coinlist', {
    parse: function (coin) {
      return new Coin(coin);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'coinMap');
  LocalContractStorage.defineProperty(this, 'id');
};

CoinList.prototype = {
  init: function () {
    this.id = 0;
  },

  save: function (name, reason, platform) {
    var from = Blockchain.transaction.from;
    var item = this.coinlist.get(name);
    if (item) {
      throw new Error('已经存在这个币种了！');
    }

    item = new Coin();
    item.id = this.id;
    item.author = from;
    item.name = name;
    item.reason = reason;
    item.platform = platform;
    this.coinMap.set(this.id, name);

    this.coinlist.put(name, item);
    this.id += 1;
  },

  get: function (name) {
    return this.coinlist.get(name);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      var name = this.coinMap.get(i);
      result[i] = this.coinlist.get(name);
    }
    return result;
  },

  toggleAgree: function (name, isAgree) {
    var from = Blockchain.transaction.from;
    var item = this.coinlist.get(name);
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

    this.coinlist.put(name, item);
  },

  comment: function (name, data) {
    var from = Blockchain.transaction.from;
    var item = this.coinlist.get(name);
    var comment = data;
    comment.author = from;
    var comments = item.comments;
    comments.push(comment);
    item.comments = comments;
    this.coinlist.put(name, item);
  }
};

module.exports = CoinList;

// d2d9589af32c96174241b8c0ca660c9003ab40bc973f10cef914c5eb97b9832d

// n1feRHe7gmEB2sm8LkGZmVMPYcZ1wJCBG2J