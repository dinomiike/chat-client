if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}
var userName = window.location.search.replace(/\?username=/, "");

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
// $.ajaxPrefilter(function(settings, _, jqXHR) {
//   jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
//   jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
// });

var sanitizeData = function(input) {
  // return input.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>(.*?)<\/\1>|<[^>]*>/, "");
  if (input) {
    // debugger;
    if (input.length < 150) {
      return input.replace(/<[^<]+?>(.*?)+<[^<]+?>|<[^>]+>/, "");
    } else {
      return input.replace(/<[^<]+?>(.*?)+<[^<]+?>|<[^>]+>/, "").substring(0,150) + "...";
    }
  } else {
    return "";
  }
};
var autherName = "", message = "";



$(document).ready(function(){
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  // Get messages
  var getMessages = function(){
    $.ajax('https://api.parse.com/1/classes/messages', {
      contentType: 'application/json',
      type: 'GET',
      data: {
        "order": '-createdAt'
      },
      success: function(data){
        $("#chatBody").text("");
        for (var i = 0; i < data.results.length; i += 1) {
          autherName = data.results[i].username || "anonymous";
          message = sanitizeData(data.results[i].text);
          $('#chatBody').append("<p><strong>" + autherName + "</strong>: " + message + "</p>");
        }
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
  };

  $('h2').text(userName);

  // Send a message
  $("#send").on("click", function(){
    $.ajax({
      type: 'POST',
      url: "https://api.parse.com/1/classes/messages",
      data: JSON.stringify({
        username: userName,
        text: $("#message").val()
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'JSON',
      success: function(data){
        // some stuff
      }
    });

 $('#message').val('').focus();

  });

  // Wait x seconds and get messages
  setInterval(getMessages, 1000);
});

var Chat = function(whatever) {

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


