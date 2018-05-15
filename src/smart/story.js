'use strict';

var Section = function (story) {
  if (story) {
    var obj = JSON.parse(story);
    this.content = obj.content;
    this.author = obj.author;
  } else {
    this.content = '';
    this.author = '';
  }
};

Section.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var User = function (obj) {
  var result = JSON.parse(obj);
  this.key = result.key;
  this.user = result.user;
};

User.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var Story = function () {
  LocalContractStorage.defineMapProperty(this, 'story', {
    parse: function (story) {
      return new Section(story);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'user', {
    parse: function (user) {
      return new User(user);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });

  LocalContractStorage.defineProperty(this, 'num', null);
};

Story.prototype = {
  init: function () {
    // todo
    this.num = 0;
  },

  add: function (data) {
    var from = Blockchain.transaction.from;

    var item = new Section();
    item.content = data;
    item.from = from;

    this.user.set(this.num, from);
    this.story.put(from, item);
    this.num += 1;
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.num; i++) {
      result[i] = this.user.get(i);
    }
    return result;
  },

  get: function () {
    var users = this.list();
    var result = [];
    for (var i = 0; i < this.users.length; i++) {
      var index = users[i];
      result[i] = this.story.get(index);
    }
    return result;
  }
};
module.exports = Story;

// n21B4DrCt7Bnisr7BKBHZ7Jb8BzDSs1XbxC
