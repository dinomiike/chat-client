var Chat = function(whatever) {
  this.userName = 'test';
};

Chat.prototype.getMessages = function() {

};

Chat.prototype.sendMessage = function(message) {
  var self = this;

  $.ajax('http://cow.com/moo', {
    success: function() {
      self.doThings(); // instead of this.doThings();
    }
  });
};

// var chat = new Chat();
