// YOUR CODE HERE:
$(document).ready(function(){

  var app = {
    currentRoom: "lobby",
    rooms: [],
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

          $("#chats").prepend("<p class='chat'>" + moment(data.createdAt).format("D/M/YYYY, h:mma") + " " + filteredUN + ": " + filteredText +"</p>")
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
          limit: 200,
          order: "-createdAt"
        },
        // data: JSON.stringify(message),
        contentType: 'application/jsonp',
        success: function (data) {
          if($("#chats").children().length < 1){
            for(var i =0; i<data.results.length; i++ ){
              var filteredText = data.results[i].text.replace(/[^\w\s]/gi, '')
              var filteredUN = data.results[i].username.replace(/[^\w\s]/gi, '')
              console.log($("#chats").children().length)

                $("#chats").append("<p class='chat'>" + moment(data.results[i].createdAt).format("D/M/YYYY, h:mma") + " " +filteredUN + ": " +filteredText +"</p>")


              if(moment(data.results[i].createdAt).format("hhmmss") > moment(new Date()).format("hhmmss") - 1){
                console.log("new")
                $("#chats").append("<p class='chat'>" + moment(data.results[i].createdAt).format("D/M/YYYY, h:mma") + " " +filteredUN + ": " +filteredText +"</p>")

              }

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
    fetchRoom: function(roomname){

      $.ajax({
        // always use this url
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: {
          limit: 1000,
          where: {"roomname": roomname},
          order: "-createdAt"
        },
        // data: JSON.stringify(message),
        contentType: 'application/jsonp',
        success: function (data) {
          for(var i =0; i<data.results.length; i++ ){
            var filteredText = data.results[i].text.replace(/[^\w\s]/gi, '')
            var filteredUN = data.results[i].username.replace(/[^\w\s]/gi, '')
                $("#chats").append("<p class='chat'>" + moment(data.results[i].createdAt).format("D/M/YYYY, h:mma") + " " +filteredUN + ": " +filteredText +"</p>")

            if(moment(data.results[i].createdAt).format("hhmmss") > moment(new Date()).format("hhmmss") - 1){
              console.log("new")
              $("#chats").append("<p class='chat'>" + moment(data.results[i].createdAt).format("D/M/YYYY, h:mma") + " " +filteredUN + ": " +filteredText +"</p>")

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
      $("#chats").prepend("<div class='chat '> <p>" + msg + " </p> </div>")
    },
    addRoom: function(room){
      $("#roomSelect").append("<div> <p>" + room + " </p> </div>")
    },
    addFriend: function(user){
      app.user.friends.push(user)
    },
    handleSubmit: function(){
      var msg = {text: $("#send #message").val(), username: getQueryVariable("username"), roomname: app.currentRoom }
      app.send(msg)
      $("#send #message").val("");
    },
    pullRooms: function(){
      $.ajax({
        // always use this url
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: {
          limit: 1000,
          order: "-createdAt"
        },
        // data: JSON.stringify(message),
        contentType: 'application/jsonp',
        success: function (data) {
          // console.log(data)
         for(var i = 0; i < data.results.length; i++){
            if(data.results[i].roomname){
              var filteredRoom = data.results[i].roomname.replace(/[^\w\s]/gi, '')
            }

            // console.log(filteredRoom)
            if(app.rooms.indexOf(filteredRoom) == -1){
              app.rooms.push(filteredRoom);

            }
         }
         // console.log(app.rooms)
         $("#rooms p").html("")
         for(var i = 0; i < app.rooms.length; i++){

          $("#rooms").append("<p>" + (i+1) + ": <a class='room "+app.rooms[i]+"' href='#' data-name='"+ app.rooms[i] +"''>" +app.rooms[i] +" </a><p>")
         }
        },
        error: function (data) {
          // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    }
  }

  $(".submit").click(function(){
    event.preventDefault()
    app.handleSubmit()

  })

  $(document).on("click", ".room", function(){
    // window.location.search = "username=" + getQueryVariable("username") +"&room=" + $(this).data().name
    console.log($(this).data())
    $("#chats").html("");
    $(".roomTitle").text($(this).data().name);
    app.currentRoom = $(this).data().name;
    app.fetchRoom($(this).data().name);
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
  app.pullRooms()
  setInterval(function() {app.pullRooms()}, 10000)
  app.fetch()
  setInterval(function(){
    app.fetch()
  }, 1000)
});
