// YOUR CODE HERE:
$(document).ready(function(){

  var app = {
    currentUser: {
      username: "dooode",
      friends: [],
      rooms: []
    },
    init : function(){},
    send: function(message){
      console.log(JSON.stringify(message))
      $.ajax({
        type: 'POST',
        url: 'https://api.parse.com/1/classes/chatterbox',
        data: JSON.stringify(message),
        contentType: "application/json",
        success: function (data) {
          console.log(data)
          var filteredText = message.text.replace(/[^\w\s]/gi, '')
          var filteredUN = message.username.replace(/[^\w\s]/gi, '')

          $("#chats").prepend("<p>" + moment(data.createdAt).format("D/M/YYYY, h:mma") + " " + filteredUN + ": " + filteredText +"</p>")
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    fetch: function(){
      $.ajax({
        // always use this url
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: {
          order: "-createdAt"
        },
        // data: JSON.stringify(message),
        contentType: 'application/jsonp',
        success: function (data) {
          for(var i =0; i<data.results.length; i++ ){
            var filteredText = data.results[i].text.replace(/[^\w\s]/gi, '')
            var filteredUN = data.results[i].username.replace(/[^\w\s]/gi, '')
            if(moment(data.results[i].createdAt).format("hhmmss") > moment(new Date()).format("hhmmss") - 1){
              console.log("new")
              $("#chats").prepend("<p>" + moment(data.results[i].createdAt).format("D/M/YYYY, h:mma") + " " +filteredUN + ": " +filteredText +"</p>")

            }

          }
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });

    },
    clearMessages : function(){
      $("#chats").children().remove()
    },
    addMessage : function(msg){
      $("#chats").prepend("<div> <p>" + msg + " </p> </div>")
    },
    addRoom: function(room){
      $("#roomSelect").append("<div> <p>" + room + " </p> </div>")
    },
    addFriend: function(user){
      app.user.friends.push(user)
    },
    handleSubmit: function(){
      var msg = {text: $("#send #message").val(), username: getQueryVariable("username"), roomname: "lobby" }
      app.send(msg)
      $("#send #message").val("");
    }
  }

  $(".submit").click(function(){
    event.preventDefault()
    console.log("hey")
    app.handleSubmit()

  })
  function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
              return decodeURIComponent(pair[1]);
          }
      }
  }
  app.fetch()
  setInterval(function(){
    app.fetch()
  }, 1000)
});
