'use strict';

var Section = function (story) {
  if (story) {
    var obj = JSON.parse(story);
    this.content = obj.content;
    this.author = obj.author;
  } else {
    this.content = [];
    this.author = '';
  }
};

Section.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var Story = function () {
  LocalContractStorage.defineMapProperty(this, 'story', {
    parse: function (text) {
      return new Section(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
  LocalContractStorage.defineProperty(this, 'storyId');
};

Story.prototype = {
  init: function () {
    // todo
    this.storyId = 0;
  },

  add: function (data) {
    var from = Blockchain.transaction.from;
    var section = new Section();
    section.content.push({
      from: from,
      content: data
    });
    section.author = from;
    var storyId = this.storyId;
    this.story.set(storyId, section);
    this.storyId += 1;
  },

  write: function (id, data) {
    var from = Blockchain.transaction.from;
    var currentStory = this.story.get(id);
    var index = currentStory.content.findIndex(function (item) {
      return item.from === from;
    });
    if (index > 0) {
      throw new Error('你已经续写过这个故事了！');
    }
    currentStory.content.push({
      from: from,
      content: data
    });
    this.story.set(id, currentStory);
  },

  list: function () {
    var result = [];
    for (var i = 0; i < this.storyId; i++) {
      result[i] = this.story.get(i);
    }
    console.log(result);
    return result;
  },

  get: function (id) {
    var result = this.story.get(id);
    return result;
  }
};
module.exports = Story;

// n1j4w7z968fCmaoPFFZ9aQCzpyUxoBLRgCP
// n1kwjXLQ867GFbXHhQwiKgYB29C5vTjXK8s
