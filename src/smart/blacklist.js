
class Company {
  constructor(obj) {
    this.key = obj.key;
    this.value = obj.value;
    this.author = obj.author;
  }
}

class BlackList {
  constructor({key, value, author}) {
    this.key = key;
    this.value = value;
    this.author = author;
    LocalContractStorage.defineMapProperty(this, "blacklist", {
      parse: (obj) => {
        return new Company(obj);
      },
      stringify: (obj) => {
        return obj.toString();
      }
    })
  }

  init() {

  }

  save(key, value) {
    const from = Blockchain.transaction.from;
    const item = new Company({from, key, value});
    this.blacklist.put(key, item);
  }

  get(key) {
    return this.blacklist.get(key);
  }
}

module.exports = BlackList;


"use strict";

var Company = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.key = obj.key;
		this.value = obj.value;
		this.author = obj.author;
	} else {
	    this.key = "";
	    this.author = "";
	    this.value = "";
	}
};

Company.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var BlackList = function () {
    LocalContractStorage.defineMapProperty(this, "blacklist", {
        parse: function (text) {
            return new Company(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

BlackList.prototype = {
    init: function () {
        // todo
    },

    save: function (key, value) {

        key = key.trim();
        value = value.trim();
        if (key === "" || value === ""){
            throw new Error("empty key / value");
        }
        if (value.length > 64 || key.length > 64){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var item = this.repo.get(key);
        if (item){
            throw new Error("value has been occupied");
        }

        item = new Company();
        item.author = from;
        item.key = key;
        item.value = value;

        this.blacklist.put(key, item);
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.blacklist.get(key);
    }
};
module.exports = BlackList;