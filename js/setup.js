if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}
var userName = window.location.search.replace(/\?username=/, "");

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

var autherName = "", message = "", friend = "", timeStamp = "2013-07-01T23:59:49.741Z";
var chatRoom = "messages", intervalId = "";


$(document).ready(function(){
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  // Get messages
  var getMessages = function(){
    $.ajax('https://api.parse.com/1/classes/' + chatRoom + '?where={"createdAt":{"$gt":{"__type":"Date","iso":"' + timeStamp + '"}}}', {
      contentType: 'application/json',
      type: 'GET',
      success: function(data){
        for (var i = 0; i < data.results.length; i += 1) {
          // if the time stamp is newer than timeStamp
          autherName = sanitizeData(data.results[i].username) || "anonymous";
          message = sanitizeData(data.results[i].text);
          if(data.results[i].username === friend){
            $('#chatBody').prepend("<p class='befriend myFriend'><strong>" + autherName + "</strong>: " + message + " (" + data.results[i].createdAt +")</p>");
            timeStamp = data.results[i].createdAt;
          } else {
            $('#chatBody').prepend("<p class='befriend'><strong>" + autherName + "</strong>: " + message + "</p>");
            timeStamp = data.results[i].createdAt;
          }
        }
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
    console.log(intervalId);
  };

  // Send a message
  var sendMessage = function(){
    $.ajax({
      type: 'POST',
      url: "https://api.parse.com/1/classes/" + chatRoom,
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
  };

  var createRoom = function() {
    chatRoom = $('#room').val();
  };

  $('#user').text('名前:' + userName);
  $('#chatroom').text('部屋:' + chatRoom);

  // Send a message
  $("#send").on("click", function(){
    sendMessage();
  });

  $("#create").on("click", function(){
    clearInterval(intervalId);
    createRoom();
    getMessages();
    $("#chatBody").html("").append("You have entered " + chatRoom);
    $('#chatroom').text('部屋:' + chatRoom);
    intervalId = setInterval(getMessages, 5000);
  });

  $("body").delegate(".befriend", "click", function(event){
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

  $("form").on("submit", function(event){
    event.preventDefault();
  });

  // Wait x seconds and get messages
  getMessages();
  intervalId = setInterval(getMessages, 5000);
});

