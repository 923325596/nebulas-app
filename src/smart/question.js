'use strict';

var Question = function (question) {
  if (question) {
    var obj = JSON.parse(question);
    this.title = obj.title;
    this.state = obj.state;
    this.author = obj.author;
    this.question = obj.question;
    this.answers = obj.answers;
    this.id = obj.id;
    this.time = obj.time;
    this.date = obj.date;
  } else {
    this.title = '';
    this.state = '';
    this.author = '';
    this.answers = [];
    this.id = '';
    this.time = '';
    this.date = '';
    this.question = '';
  }
};

Question.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var QuestionNaire = function () {
  LocalContractStorage.defineMapProperty(this, 'questionlist', {
    parse: function (question) {
      return new Question(question);
    },
    stringify: function (obj) {
      return obj.toString();
    }
  });
  LocalContractStorage.defineMapProperty(this, 'questionMap');
  LocalContractStorage.defineProperty(this, 'id');
};

QuestionNaire.prototype = {
  init: function () {
    this.id = 0;
  },

  create: function (title, date, state, question) {
    var from = Blockchain.transaction.from;
    var item = this.questionlist.get(title);
    if (item) {
      throw new Error('已经存在这条记录了');
    }

    item = new Question();
    item.id = this.id;
    item.author = from;
    item.title = title;
    item.state = state;
    item.question = question;
    item.date = date;
    var d = new Date();
    item.time = d.toString();
    this.questionMap.set(this.id, title);

    this.questionlist.put(title, item);
    this.id += 1;
  },

  get: function (id) {
    var title = this.questionMap.get(id);
    return this.questionlist.get(title);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.id; i++) {
      var title = this.questionMap.get(i);
      result[i] = this.questionlist.get(title);
    }
    return result;
  },

  len: function () {
    return this.id;
  },

  query: function (page) {
    var size = page * 10;
    if (size > this.id) {
      size = this.id;
    }
    var result = [];
    var start = (page - 1) * 10;
    for (var i = start; i < size; i++) {
      var title = this.questionMap.get(i);
      result[i] = this.questionlist.get(title);
    }
    return result;
  },

  answer: function (id, data) {
    var from = Blockchain.transaction.from;
    var title = this.questionMap.get(id);
    var item = this.questionlist.get(title);
    var answers = item.answers;
    var repeat = answers.findIndex(function (answer) {
      return answer.author === from;
    });
    if (repeat !== -1) {
      throw new Error('你已经提交过问卷了，请不要重复提交');
    }
    var answer = {
      author: from,
      data: data
    };
    answers.push(answer);
    item.answers = answers;
    this.questionlist.put(title, item);
  }
};

module.exports = QuestionNaire;

// n1gGz8QkZevfryw2Z3sD48t6xzYThTZgFpC
// 3c3a031fe9e53cb4a31407cebdce62a7d71dcf593a1e8178e892a5bdb1da3ca9
