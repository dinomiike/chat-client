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
var autherName = "", message = "", friend = "", timeStamp = "";



$(document).ready(function(){
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  // Get messages
  var getMessages = function(){
    $.ajax('https://api.parse.com/1/classes/hrTest5', {
      contentType: 'application/json',
      type: 'GET',
      data: {
        "order": '-createdAt'
      },
      success: function(data){
        // debugger;
        // $("#chatBody").text("");
        for (var i = data.results.length - 1; i > 0; i -= 1) {
          // if the time stamp is newer than timeStamp
          autherName = sanitizeData(data.results[i].username) || "anonymous";
          message = sanitizeData(data.results[i].text);
          if (timeStamp === "") {
            $('#chatBody').prepend("<p class='befriend'><strong>" + autherName + "</strong>: " + message + " (" + data.results[i].createdAt +")</p>");
          } else if (data.results[i].createdAt > timeStamp){
            // else ignore it?
            // debugger;
            $('#chatBody').prepend("<p class='befriend'><strong>" + autherName + "</strong>: " + message + " (" + data.results[i].createdAt +")</p>");
          }
        }
        timeStamp = data.results[data.results.length-1].createdAt;
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
      url: "https://api.parse.com/1/classes/hrTest5",
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

  $("body").on("click", ".befriend", function(event){
    // Get the name of the person you clicked on
    friend = $(this).children()[0];
    friend = $(friend).text();
    console.log(friend);

    // Get all the objects in the chat room into an array
    var friends = $(".befriend strong").toArray();

    // Loop through all chats
    for (var i = 0; i < friends.length; i += 1) {
      // If the current chat is from the friend you clicked on...
      if ($(friends[i]).text() === friend) {
        // Add a style to their class
        $(friends[i]).parent().toggleClass("myFriend");
      }
    }
  });

  // Wait x seconds and get messages
  getMessages();
  setInterval(getMessages, 5000);
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


