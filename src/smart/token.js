'use strict';

var Token = function (token) {
  if (token) {
    var obj = JSON.parse(token);
    this.name = obj.name;
    this.description = obj.description;
    this.content = obj.content;
    this.icon = obj.icon;
    this.rank = obj.rank;
    this.author = obj.author;
    this.site = obj.site;
    this.like = obj.like;
    this.comments = obj.comments;
    this.id = obj.id;
  } else {
    this.name = '';
    this.description = '';
    this.content = '';
    this.icon = '';
    this.rank = '';
    this.author = '';
    this.site = '';
    this.like = [];
    this.comments = [];
    this.id = '';
  }
};

Token.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var TokenList = function () {
  LocalContractStorage.defineMapProperty(this, 'tokenlist', {
    parse: function (token) {
      return new Token(token);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'tokenMap');
  LocalContractStorage.defineProperty(this, 'id');
};

TokenList.prototype = {
  init: function () {
    this.id = 0;
  },

  save: function (name, description, content, rank, site, icon) {
    var from = Blockchain.transaction.from;
    var item = this.tokenlist.get(name);
    if (item) {
      throw new Error('已经存在这个Token了！');
    }

    item = new Token();
    item.id = this.id;
    item.author = from;
    item.name = name;
    item.description = description;
    item.content = content;
    item.rank = rank;
    item.site = site;
    item.icon = icon;
    this.tokenMap.set(this.id, name);

    this.tokenlist.put(name, item);
    this.id += 1;
  },

  get: function (name) {
    return this.tokenlist.get(name);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      var name = this.tokenMap.get(i);
      result[i] = this.tokenlist.get(name);
    }
    return result;
  },

  like: function (name) {
    var from = Blockchain.transaction.from;
    var item = this.tokenlist.get(name);
    var likeArr = item.like;
    var likeIndex;
    likeIndex = likeArr.indexOf(from);
    if (likeIndex !== -1) {
      likeArr.splice(likeIndex, 1);
    } else {
      likeArr.push(from);
    }
    item.like = likeArr;

    this.tokenlist.put(name, item);
  },

  comment: function (name, data) {
    var from = Blockchain.transaction.from;
    var item = this.tokenlist.get(name);
    var comment = {
      data: data,
      author: from
    };
    var comments = item.comments;
    comments.push(comment);
    item.comments = comments;
    this.tokenlist.put(name, item);
  }
};

module.exports = TokenList;

// n1wjbbUn9i8o6sw8VgYkbG9xSxwb3tAVb5X

// 08fd698d846e6cc88fbb27feadbe86bd9c905b1639666eed1b996c2bb80ed19e