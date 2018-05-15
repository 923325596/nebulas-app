'use strict';

var Vote = function (vote) {
  if (vote) {
    var obj = JSON.parse(vote);
    this.data = obj.data.map(function (item) {
      return {
        item: item,
        value: 0
      };
    });
    this.id = obj.id;
  } else {
    this.data = [];
    this.id = '';
  }
};

Vote.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var VoteClass = function () {
  LocalContractStorage.defineMapProperty(this, 'votelist', {
    parse: function (vote) {
      return new Vote(vote);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'votelist', {
    parse: function (vote) {
      return new Vote(vote);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
};

VoteClass.prototype = {
  init: function () {
    // todo
  },

  create: function (title, data) {
    var hash = Blockchain.transaction.hash;
    var item = this.blacklist.get(name);
    if (item) {
      throw new Error('投票标题重复');
    }

    item = new Vote();
    item.id = hash;
    item.data = data;

    this.votelist.put(id, item);
  },

  get: function () {
    return this.votelist.get();
  },

  getById: function (id) {
    return this.votelist.get(id);
  },

  vote: function (id) {
    return this.votelist.get(id);
  }
};
module.exports = VoteClass;
