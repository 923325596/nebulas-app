'use strict';

var Home = function (params) {
  if (params) {
    var obj = JSON.parse(params);
    this.title = obj.title;
    this.name = obj.name;
    this.phone = obj.phone;
    this.area = obj.area;
    this.content = obj.content;
    this.isRent = obj.isRent;
    this.author = obj.author;
  } else {
    this.title = '';
    this.name = '';
    this.phone = '';
    this.area = '';
    this.content = '';
    this.isRent = '';
    this.author = '';
  }
};

Home.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var House = function () {
  LocalContractStorage.defineMapProperty(this, 'home', {
    parse: function (text) {
      return new Home(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'homeMap');
  LocalContractStorage.defineProperty(this, 'homeId');
};

House.prototype = {
  init: function () {
    // todo
    this.homeId = 0;
  },

  add: function (title, name, phone, area, content, isRent) {
    var from = Blockchain.transaction.from;
    var item = this.home.get(from);
    if (item) {
      throw new Error('每人只能发布一条信息喔！');
    }
    var home = new Home();
    home.title = title;
    home.name = name;
    home.phone = phone;
    home.area = area;
    home.content = content;
    home.isRent = isRent;
    home.author = from;
    this.home.set(from, home);
    var id = this.homeId;
    this.homeMap.set(id, from);
    this.homeId += 1;
  },

  del: function (author) {
    var from = Blockchain.transaction.from;
    if (from !== author) {
      throw new Error('只有发布人才能操作喔！');
    }
    var item = this.home.get(from);
    this.home.del(from);
  },

  list: function () {
    var result = [];
    var from;
    var home;
    for (var i = 0; i < this.homeId; i++) {
      from = this.homeMap.get(i);
      home = this.home.get(from);
      if (home) {
        result[i] = home;
      }
    }
    console.log(result);
    return result;
  }
};
module.exports = House;

// n1oyT36xYjgMVHG55rJHcxwAuLCrJzKMrGZ

// 113c1cfe1898f9970ac23450bfcdd55403426da7e9ac8d823c8dd1b6b5b24505
