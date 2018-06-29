'use strict';

var Phone = function (company) {
  if (company) {
    var obj = JSON.parse(company);
    this.phone = obj.phone;
    this.type = obj.type;
    this.author = obj.author;
    this.description = obj.description;
  } else {
    this.phone = '';
    this.type = [];
    this.author = [];
    this.description = '';
  }
};

Phone.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var PhoneClass = function () {
  LocalContractStorage.defineMapProperty(this, 'phonelist', {
    parse: function (phone) {
      return new Phone(phone);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'phoneMap');
  LocalContractStorage.defineProperty(this, 'id');
};

PhoneClass.prototype = {
  init: function () {
    this.id = 0;
  },

  save: function (phone, type, description) {
    if (phone === '' || type === '') {
      throw new Error('empty phone / type');
    }

    var from = Blockchain.transaction.from;
    var item = this.phonelist.get(phone);
    if (!item) {
      item = new Phone();
      item.phone = phone;
      this.phoneMap.set(this.id, phone);
      item.description = description;
    } else {
      item.description = item.description + '|' + description;
    }
    item.author.push(from);
    if (item.type.indexOf(type) === -1) {
      item.type.push(type);
    }

    this.phonelist.put(phone, item);
    this.id += 1;
  },

  get: function (key) {
    if (key === '') {
      throw new Error('empty key');
    }
    return this.phonelist.get(key);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      var key = this.phoneMap.get(i);
      result[i] = this.phonelist.get(key);
    }
    return result;
  }
};

module.exports = PhoneClass;

// n2315uMgpeDLmsQ9DQvZPsm9GdJoJ6M4o5B

// bc79e81aba2810c1fa38f70ec82862c1e66689362b2ed1cedbe357627947da06