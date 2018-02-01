

var gameObjects = {
  playerShip: '',
  landingPads: [],
  mapBuildings: [],
  backgroundBuildings: [],
  gameWindow: '',
  access: false,
  dudes: [],
};
//------------------
//ship game code
//------------------

function startShipGame() {
  gameObjects.playerShip = new component(60, 40, "img/ship.gif", 10, 10, "image");
  gameObjects.gameWindow.start();
}

gameObjects.gameWindow = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = 750;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      $('#sideScrollWindow').append(this.canvas);
      $(this.canvas).attr('id', 'cityCanvas');
      window.addEventListener('keydown', function (e) {
          gameObjects.gameWindow.keys = (gameObjects.gameWindow.keys || []);
          gameObjects.gameWindow.keys[e.keyCode] = true;
      })
      window.addEventListener('keyup', function (e) {
          gameObjects.gameWindow.keys[e.keyCode] = false;
      })
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
    $(this.canvas).fadeOut();
    setTimeout(startShipGame, 1000);
    $(this.canvas).delay(1000).fadeIn();
  },
  land : function() {
    clearInterval(this.interval);
    $(this.canvas).fadeOut(0);
    function removeSideScroll() {
    $('#sideScrollWindow').html('');
    window.removeEventListener('keydown', function(){});
    window.removeEventListener('keyup', function(){});
    }
    removeSideScroll();
    // setTimeout(removeSideScroll, 3000);
    var myKindOfTerminal = myTerminal ;
    showQuery(myKindOfTerminal); // call the Terminal object and ask its "questions."
    // talkToFolks(gameObjects.dudes[0]);
    $('#commHackWindow').show();
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
      ctx = gameObjects.gameWindow.context;
      if (type == "image") {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.hitSide();
  }
  this.hitSide = function() {
    var bottom = gameObjects.gameWindow.canvas.height - this.height;
    var top = 0;
    var left = 0;
    var right = gameObjects.gameWindow.canvas.width - this.width;
    if (this.y > bottom) {this.y = bottom;}
    if (this.y < top) {this.y = top;}
    if (this.x < left) {this.x = left;}
    if (this.x > right) {this.x = right;}
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
  }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  var interval =  Math.floor(Math.random() * 1.2);
  var slowInterval = Math.floor(Math.random() * .8);
  for (i = 0; i < gameObjects.mapBuildings.length; i += 1) {
    if (gameObjects.playerShip.crashWith(gameObjects.mapBuildings[i])) {
        gameObjects.gameWindow.stop();
        return;
    }
  }
  for (i = 0; i < gameObjects.landingPads.length; i += 1) {
    if (gameObjects.playerShip.crashWith(gameObjects.landingPads[i])) {
        gameObjects.gameWindow.land();
        return;
    }
  }
  gameObjects.gameWindow.clear();
  gameObjects.gameWindow.frameNo += 1;
  if (gameObjects.gameWindow.frameNo == 1 || everyinterval(interval * 30)) {
    x = gameObjects.gameWindow.canvas.width;
    y = gameObjects.gameWindow.canvas.height

    gameObjects.landingPads.push(new component(80, 340, "img/building3.png", x, y - 220, "image"));
  }
  if (gameObjects.gameWindow.frameNo == 1 || everyinterval(interval)) {
    x = gameObjects.gameWindow.canvas.width;
    y = gameObjects.gameWindow.canvas.height
    height = 80;
    minHeight = 10;
    maxHeight = 210;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    gameObjects.mapBuildings.push(new component(100, height + 30, "img/building1.png", x - 30, y - height, "image"));
  }

  for (i = 0; i < gameObjects.landingPads.length; i += 1) {
      gameObjects.landingPads[i].x += -4;
      gameObjects.landingPads[i].update();
  }
  for (i = 0; i < gameObjects.backgroundBuildings.length; i += 1) {
      gameObjects.backgroundBuildings[i].x += -2;
      gameObjects.backgroundBuildings[i].update();
  }
  for (i = 0; i < gameObjects.mapBuildings.length; i += 1) {
      gameObjects.mapBuildings[i].x += -4;
      gameObjects.mapBuildings[i].update();
  }
  gameObjects.playerShip.speedX = 0;
  gameObjects.playerShip.speedY = 0;
  if (gameObjects.gameWindow.keys && gameObjects.gameWindow.keys[65]) {gameObjects.playerShip.speedX = -5; }
  if (gameObjects.gameWindow.keys && gameObjects.gameWindow.keys[68]) {gameObjects.playerShip.speedX = 10; }
  if (gameObjects.gameWindow.keys && gameObjects.gameWindow.keys[87]) {gameObjects.playerShip.speedY = -5; }
  if (gameObjects.gameWindow.keys && gameObjects.gameWindow.keys[83]) {gameObjects.playerShip.speedY = 5; }
  gameObjects.playerShip.newPos();
  gameObjects.playerShip.update();

}

function everyinterval(n) {
  if ((gameObjects.gameWindow.frameNo / n) % 1 == 0) {return true;}
  return false;
}
//-------------------
//end ship game code
//-------------------
//-------------------
//comm hack game code
//-------------------

// var access = false; // Global var that should be tracked in the Game object instead.
                    // It's used to pass access from a terminal that's successfully
                    // accessed.

function ComputerTerminal (status, name, buildingLocationNumber, roomNumber, locationX, locationY, type, questionArray, answerArray, success, failure) {
  this.status = status;
  this.name = name;
  this.buildingLocationNumber = buildingLocationNumber;
  this.roomNumber = roomNumber;
  this.locationX = locationX;
  this.locationY = locationY;
  this.type = type;
  this.questionArray = questionArray;
  this.answerArray = answerArray;
  this.success = success;
  this.failure = failure;
}

ComputerTerminal.prototype.verifyAnswer = function (answer) { // pass in the answer as array or string
  var compare = 0;
  // console.log("this answer is " + this.answerArray);
  // console.log("your answer is " + answer);
  for (var i=0; i < answer.length; i++) {
    if (answer[i] === this.answerArray[i]) { compare ++;}
  }
  if (compare === this.answerArray.length) { return true; } else { return false;}
};

function Denizen(name, pic, greet, questions, answer1, answer2, answer3, items, level) {
  this.name = name;
  this.pic = pic;
  this.greet = greet;
  this.questions = questions; // array
  this.answer1 = answer1;
  this.answer2 = answer2; //array of future answers
  this.answer3 = answer3; // "Tell me what happened here?", ["", "", "", "", ""]
  this.items = items;
  this.level = level; // if level is 5 then that's the CEO. You catch him and leave.
}

// User Interface Logic

function drawKeypad(){
  for (var i = 1; i < 10; i++) {
    // myI = "<h2>" + " " + i + " " + "</h2>" + "<br>";
    myI = "<h2>" + " " + i + " " + "</h2>";
    $("#" + i).append(myI);
  }
}

function showQuery(someTerminal){
  var combo = "";
  var combo1 = "";
  var colors = ["red", "green", "blue", "yellow"];
  var answerColors = [];
  var myColor = -1;
  if (someTerminal.type ==="colors") {
    for (var i = 0; i < someTerminal.questionArray.length; i++){
      combo += someTerminal.questionArray[i];
    }
    for (var i = 1; i < someTerminal.questionArray.length + 1; i++){
      if(someTerminal.questionArray[i-1] === "R") {
        $("#show"+i).css("background-color", "red");
      } else if (someTerminal.questionArray[i-1] === "G") {
        $("#show"+i).css("background-color", "green");
      } else if (someTerminal.questionArray[i-1] === "B") {
        $("#show"+i).css("background-color", "blue");
      } else {
        $("#show"+i).css("background-color", "yellow");
      }
    }
    var myButton = '<div class="col-md-2">' +
      '<button class="btn btn-primary" name="myButton" type="button" id="myButton">Submit</button>' +
    '</div>'; // type="submit"
    $("#formLine").html(myButton);
    $('#colorboxes').bind('click', function(event) {
      myColor++;
      if (myColor > colors.length) { myColor = 0; }
      if (event.target.id.substring(0, 4) === "tell" && event.target.id.length > 4){
        $("#" + event.target.id).css( "background-color", colors[myColor] );
        var x = event.target.id.substr(event.target.id.length - 1);
        // alert("x = " + x);
        answerColors[x-1] = colors[myColor];
        console.log("The answer colors array is now: " + answerColors);
      }
    });
    $('#myButton').bind('click', function(event) {
      var ygody = someTerminal.verifyAnswer(answerColors);
      if(someTerminal.verifyAnswer(answerColors)) {
        gameObjects.access = true;
        $('#colorboxes').unbind();
        $('#myButton').unbind();
        alert("You solved the code! " + gameObjects.access);
        return;
      } else {
        alert("You have failed!");
      }
    });
    x = combo;
    $("#colorboxes").css( "display", "block" );
  } else if (someTerminal.type ==="questions") {
    alert("questions");
    for (var i = 0; i < someTerminal.questionArray.length; i++){
      combo += someTerminal.questionArray[i] + "\n";
      combo1 += someTerminal.questionArray[i] + "<br><br>";
    }
    x = "none";
    $("#ask").append("<h2>" + combo1 + "</h2>");
    $("#question").css( "display", "block" );
  } else if (someTerminal.type ==="keypad") {
    alert("KEYPAD!");
    for (var i = 0; i < (someTerminal.questionArray.length); i+=3){
      combo += someTerminal.questionArray[i] + " : ";
      combo1 += someTerminal.questionArray[i];
      combo += someTerminal.questionArray[i + 1] + " : ";
      combo1 += someTerminal.questionArray[i + 1];
      combo += someTerminal.questionArray[i + 2] + "\n";
      combo1 += someTerminal.questionArray[i + 2];
    }
    x = "none";
    drawKeypad();
    $("#keypad").css( "display", "block");
  } else return "Destroyed!";
  return x;
}

function talkToFolks (personObject){
  var key=0;
  $(document).on('keydown', function(e){
      key = e.which;
      console.log("key is: " + key);
      checkKey(key);
  });
  function checkKey(myKey) {
  // var myKey ="0"
    var newString = "";
    var newString1 = "";
    if (myKey === 49) {
      // alert("New String: " +newString);
      newString ="";
      console.log("Got my key of 49!");
      var tempQ = personObject.answer1;
      for (var i = 0; i < tempQ.length; i++) {
        newString += tempQ[i];
        if (tempQ[i] === "X") {
          var temp = tempQ[i] + tempQ[i +1] + tempQ[i +2];
          if (temp === "XXX") {
            newString =  tempQ.substring(0, i) + personObject.name + tempQ.substring(i+3, tempQ.length);
            i = tempQ.length;
          }
        }
      }
      $("#li1").css("color", "rgb(239, 142, 147)"); // was rgb(239, 242, 247)
      $("#li2").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li3").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li4").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#theyReply").empty();
      $("#theyReply").html("<strong><p>" +  newString + "</p></strong>"); // what is myString now?
    }
    if (myKey === 50) { // pressed 2
      $("#li1").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li2").css("color", "rgb(239, 142, 147)"); // was rgb(239, 242, 247)
      $("#li3").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li4").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#people").off();
        $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
        newString = "<ol type='a'>";
        for (var i = 1; i < 6; i++){
          var i1 = i +10; // ************************
          newString += "<li id='li" + i1 + "'>" + personObject.answer2[i] + "</li>";
        }
        newString += "</ol>";
        $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
        $("#theyReply").append("<p>" +  newString + "</p>");
        $(document).on('keypress', function(e){
            key = e.which;
            // console.log("key is: " + key);
            var x = Math.floor(Math.random() * 5) + 1;
            if (key === 97) {
              console.log("It's an a!");
              console.log(personObject.answer2[6 + x + 0]); // offset is 2
              newString1 = personObject.answer2[6 + x + 0];
              $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
              $("#theyReply").append("<p>" +  newString + "</p>");
              $("#theyReply").append("<br><strong><p>" +  newString1 + "</p></strong>");
              $("#li11").css("color", "rgb(239, 142, 147)");
              $("#li12").css("color", "rgb(0,0,0)");
              $("#li13").css("color", "rgb(0,0,0)");
              $("#li14").css("color", "rgb(0,0,0)");
              $("#li15").css("color", "rgb(0,0,0)");
            } else if (key === 98) {
              console.log("It's an b!");
              console.log(personObject.answer2[6 + x + 5]); // offset is 8
              newString1 = personObject.answer2[6 + x + 5];
              $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
              $("#theyReply").append("<p>" +  newString + "</p>");
              $("#theyReply").append("<br><strong><p>" +  newString1 + "</p></strong>");
              $("#li12").css("color", "rgb(239, 142, 147)");
              $("#li11").css("color", "rgb(0,0,0)");
              $("#li13").css("color", "rgb(0,0,0)");
              $("#li14").css("color", "rgb(0,0,0)");
              $("#li15").css("color", "rgb(0,0,0)");
            } else if (key === 99) {
              console.log("It's an c!");
              console.log(personObject.answer2[6 + x + 10]); // offset is 14
              newString1 = personObject.answer2[6 + x + 10];
              $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
              $("#theyReply").append("<p>" +  newString + "</p>");
              $("#theyReply").append("<br><strong><p>" +  newString1 + "</p></strong>");
              $("#li13").css("color", "rgb(239, 142, 147)");
              $("#li12").css("color", "rgb(0,0,0)");
              $("#li11").css("color", "rgb(0,0,0)");
              $("#li14").css("color", "rgb(0,0,0)");
              $("#li15").css("color", "rgb(0,0,0)");
            } else if (key === 100) {
              console.log("It's an d!");
              console.log(personObject.answer2[6 + x + 15]); // offset is 20
              newString1 = personObject.answer2[6 + x + 15];
              $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
              $("#theyReply").append("<p>" +  newString + "</p>");
              $("#theyReply").append("<br><strong><p>" +  newString1 + "</p></strong>");
              $("#li14").css("color", "rgb(239, 142, 147)");
              $("#li12").css("color", "rgb(0,0,0)");
              $("#li13").css("color", "rgb(0,0,0)");
              $("#li11").css("color", "rgb(0,0,0)");
              $("#li15").css("color", "rgb(0,0,0)");
            } else if (key === 101) {
              console.log("It's an e!");
              console.log(personObject.answer2[6 + x +20]); // offset is 26
              newString1 = personObject.answer2[6 + x + 20];
              $("#theyReply").html("<strong>" + personObject.answer2[0] + "</strong><br>");
              $("#theyReply").append("<p>" +  newString + "</p>");
              $("#theyReply").append("<br><strong><p>" +  newString1 + "</p></strong>");
              $("#li15").css("color", "rgb(239, 142, 147)");
              $("#li12").css("color", "rgb(0,0,0)");
              $("#li13").css("color", "rgb(0,0,0)");
              $("#li14").css("color", "rgb(0,0,0)");
              $("#li11").css("color", "rgb(0,0,0)");
            }
        });
    }
    if (myKey === 51) {
      var temp = (Math.floor(Math.random() * personObject.answer3.length));
      var newString2 = personObject.answer3[temp];
      $("#li3").css("color", "rgb(239, 142, 147)");
      $("#li1").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li2").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#li4").css("color", "rgb(0,0,0)"); // was rgb(239, 242, 247)
      $("#theyReply").html("<strong><p>" +  newString2 + "</p></strong>");
    }
    if (myKey === 52) {
      exit = true;
      $("#people").off();
        $("#people").css("display", "none");
      return;
    }
  } // end of function
  $(".container").css( "display", "none" );
  $(".decorateMe").css( "display", "block" );
  $("#picture").html( "<img src=" + personObject.pic + " alt='Their Picture' height: '100'>");
  $("#narration").html( "<p>You walk up and speak to " + personObject.name + ".</p>");
  $("#theyAsk").html("<p>" +  personObject.greet + "</p>");
  $("#youAnswer").html("<ol><li id='li1'>" +  personObject.questions[0] + "</li><li id='li2'>" +  personObject.questions[1] + "</li><li id='li3'>" +  personObject.questions[2] + "</li><li>I'm done with you.</li></ol>");
}
//-------------------
//end comm hack code
//-------------------

$(document).ready(function() {
  $("#startButton").click(function(event){
    event.preventDefault();
    $("#titleScreen").hide();
    startShipGame();

    // var dudes = [];
    // terminals are hardcoded.
    myTerminal = new ComputerTerminal("Locked", "Terminal", 1, 1, 10, 10, "colors", ["B","G","B","Y","B"], ["red","green","blue","yellow","blue"], "OPEN", "ALARM-5");
    myQuestionTerminal = new ComputerTerminal("Locked", "Terminal", 1, 1, 10, 10, "questions", ["What is your favorite color?", "1. Red", "2. Blue", "3. Purple"], ["3"], "OPEN", "ALARM-5");
    myKeypadTerminal = new ComputerTerminal("Locked", "Terminal", 1, 1, 10, 10, "keypad", [1,2,3,4,5,6,7,8,9], ["3"], "OPEN", "ALARM-5");

    function makeNewDude(myName, myPic, myGreet, myQuestions, myAnswer1, myAnswer2, myAnswer3, myItems, myLevel) {
      gameObjects.dudes.push(new Denizen(myName, myPic, myGreet, myQuestions, myAnswer1, myAnswer2, myAnswer3, myItems, myLevel));
    }

    makeNewDude("Lykez Munnee", "img/drone.jpg", "What do you want?", ["Who are you?", "Can you help me?", "What happened here?!"], "My name is XXX. I'm nobody. I just work here.",
    ["Help you do what?",
    "Deactivate Robots?", "Tell me where the CEO is?", "Give me a terminal code?", "Tell me what level I'm on?", "Give me a door access key?",
    "No.", "Of course. Use code Red Green Blue Yellow Blue on the terminal", "Get out of here!", "Why do you want to do that?", "I think they can't be stopped!",
    "No.", "Of course not!", "Why would I tell you that?", "I don't know, I just work here.", "Sure. He's on level 5!",
    "No way!", "I don't have that kind of thing!", "Why would you want that? Are you a spy?", "Pound sand, Earther!", "Sure. It's 22343.",
    "Read a map, idiot.", "I don't have time for simple questions.", "Are you serious?", "Yes. It's level NNN", "Go away! I'm working!",
    "Get real!", "Sure. Here's a Yellow.", "Sure. Here's a Blue.", "Sure. Here's a Red.", "No way!", "I'm going to have to tell the boss!"],
    ["I don't really know. I just work here. <br>", "A few months ago a lot of ships started coming here . . . <br> weird ones with no designations and no passengers.<br>", "I don't know why but the company is on lockdown and <br>we can't go back to our homes.", "They've been working us like dogs and <br>management has disappeard!"]);

    // ********************************
    // * Set the terminal type to
    // * the right object type.
    // * Terminal choices are:
    // * myTerminal as Color Boxes,
    // * myQuestionTerminal as a
    // * list of questions (deactivated),
    // * and myKwyPadTerminal which is
    // * not completely implemented.
    // *
    // * var myKindOfTerminal = myTerminal;
    // * var myKindOfTerminal = myQuestionTerminal;
    // * var myKindOfTerminal = myKeypadTerminal;
    // *
    // *********************************

    // var myKindOfTerminal = myTerminal ;
    // showQuery(myKindOfTerminal); // call the Terminal object and ask its "questions."

    // *********************************
    // Call the function to pop up
    // a person, currentl person 0.
    // *
    // * talkToFolks(dudes[0]); // <-- this routine also handles its input validation
    // *
    // *********************************

    $(document).submit(function(e) {
      e.preventDefault();
      var myAnswer = "";
      if ($("#colorAnswers").val()) { alert ($("#colorAnswers").val()); } else if ($("#keyAnswers").val()) { alert ($("#keyAnswers").val()); } else if ($("#answers").val()){ alert($("#answers").val()); } else { alert("No answer!"); }
      // this is legacy code for testing the keypad and question consoles via a Form.
    });
  });
})
