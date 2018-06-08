'use strict';

var Vote = function (vote) {
  if (vote) {
    var obj = JSON.parse(vote);
    this.title = obj.title;
    this.description = obj.description;
    this.data = obj.data;
    this.id = obj.id;
    this.author = obj.author;
    this.date = obj.date;
  } else {
    this.data = [];
    this.id = '';
    this.author = '';
    this.date = '';
    this.title = '';
    this.description = '';
  }
};

Vote.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var VoteClass = function () {
  LocalContractStorage.defineMapProperty(this, 'list', {
    parse: function (vote) {
      return new Vote(vote);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineProperty(this, 'id');
};

VoteClass.prototype = {
  init: function () {
    this.id = 0;
  },

  create: function (title, description, date, data) {
    var from = Blockchain.transaction.from;

    var item = new Vote();
    item.id = this.id;
    item.title = title,
    item.description = description;
    item.date = date;
    item.data = data;
    item.author = from;

    this.list.put(this.id, item);
    this.id += 1;
  },

  get: function (id) {
    return this.list.get(id);
  },

  vote: function (id, option) {
    var from = Blockchain.transaction.from; 
    var vote = this.list.get(id);
    var dataArr = vote.data;
    var newData = dataArr.map(function (item) {
      var list = item.list;
      var repeatIndex = list.indexOf(from);
      if (repeatIndex !== -1) {
        list.splice(repeatIndex, 1);
      }
      if (item.option === option) {
        var index = list.indexOf(from);
        if (index !== -1) {
          list.splice(index, 1);
        } else {
          list.push(from);
        }
      }
      return {
        option: item.option,
        list: list
      };
    });
    vote.data = newData;

    this.list.put(id, vote);
  },

  getList: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      result[i] = this.list.get(i);
    }
    return result;
  }
};
module.exports = VoteClass;

// b717bb29120192ba8d61691cd6e1ae4b71ac0b91111b2ee1d1abb8c78611ebb9