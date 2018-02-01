//-------------------------------------------
// All variable used by each set of game code
//-------------------------------------------
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
    $(".test").show();
    $(".test").html("Game Over");
    // $('.test').delay(1000).hide();
    // setTimeout(startShipGame, 1000);
    // $(this.canvas).delay(1000).fadeIn();
  },
  //---------------------------------
  //Transition function for ship game
  //hello
  //--------------------------------
  land : function() {
    clearInterval(this.interval);
    $(this.canvas).fadeOut(0);
    function removeSideScroll() {
    $('#sideScrollWindow').html('');
    window.removeEventListener('keydown', function(){});
    window.removeEventListener('keyup', function(){});
    }
    removeSideScroll();

    $("body").css('background-image', 'none');
     $("body").css('background', 'black');
    // setTimeout(removeSideScroll, 3000);
    Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
    // var myKindOfTerminal = myTerminal ;
    // showQuery(myKindOfTerminal); // call the Terminal object and ask its "questions."
    // talkToFolks(gameObjects.dudes[0]);
    $('#commHackWindow').show();
  }
  //---------------------------------
  //End function for transition
  //--------------------------------
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
  // alert(someTerminal.type);
  var combo = "";
  var combo1 = "";
  var colors = ["red", "green", "blue", "yellow"];
  var answerColors = [];
  var myColor = -1;
  if (someTerminal.type === "colors") {
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
    // alert("Got past build");


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
        //hello
        $('.panel').hide();
        $('#display').show();
        player1.pause = false;
        player1.disableAllRobots = true;
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
      //hello
      exit = true;
      $("#people").off();
      $("#people").css("display", "none");
      $("#display").show();
      $('#commHackWindow').hide();
      player1.pause = false;


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

//-------------------
//room code
//-------------------

var mapLayout = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+
'x________________________________________________x'+
'x________________________@_______________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________!_______________________________x'+
'x_________[]_______________________________[]____x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x____!________________________x__________________x'+
'x_______________________[]_______________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x______________________[]________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x_____________[]____________________________!____x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________='+
'x_____________________[]_________________________='+
'x________________________________________________='+
'x_________________________________________[]_____x'+
'x_______!___________________[]___________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x_________________________x________________!_____x'+
'x____[]__________________________________________x'+
'x________________________________________________x'+
'x______________________________________[]________x'+
'x____________&___________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x____[]___________8_____________[]_______________x'+
'xxxxxxxxxxxxxxxxx===xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

function Player(xCoord, yCoord, facing) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.currentSpot = 2018;
  this.nextSpot = "";
  this.facing = "up";
  this.pause = false;
  this.nextX = xCoord;
  this.nextX2 = xCoord-1;
  this.nextY = yCoord;
  this.nextY2 = yCoord;
  this.disableAllRobots = false;
}

function Robot(xCoord, yCoord, facing) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.currentSpot = "";
  this.nextSpot = "";
  this.status = true;
  this.facing = "top";
  this.sight = "nothing";
  this.nextX = xCoord;
  this.nextX2 = xCoord-1;
  this.nextY = yCoord;
  this.nextY2 = yCoord;
  this.randomStore = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  this.randomZero = 0;
  this.isFunctional = true;
}

var player1 = new Player(18,40, "down");

var robot1 = new Robot(5,10);
var robot2 = new Robot(44,23);
var robot3 = new Robot(8,30);
var robot4 = new Robot(43,33);


Robot.prototype.checkForPlayers = function() {
  this.currentSpot = passConvertCoordinates(this.xCoord,this.yCoord);
  var spotSelector = this.currentSpot+1;


  if (this.randomZero < 5){
    this.randomZero++;
  } else {
    this.randomStore = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    this.randomZero = 0;
  }

  if (this.randomStore == 1) {
  //right
    this.facing = "right";
    while (this.nextX < 48) {
      this.nextX = this.nextX+1;
      replaceSpot = passConvertCoordinates(this.nextX,this.yCoord);
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        this.nextX = 48;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "*");
      }
      if (mapLayout.charAt(replaceSpot) == 8) {this.sight="player"}
    }
    this.nextX = this.xCoord;
  }
  if (this.randomStore == 2) {
    //left
    this.facing = "left";
    while (this.nextX2 > 1) {
      this.nextX2 = this.nextX2-1;
      replaceSpot = passConvertCoordinates(this.nextX2,this.yCoord);
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        this.nextX2 = 1;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "*");
      }
      if (mapLayout.charAt(replaceSpot) == 8) {this.sight="player"}
    }
    this.nextX2 = this.xCoord;
  }
  if (this.randomStore == 3) {
    //up
    this.facing = "top";
    while (this.nextY > 1) {
      this.nextY = this.nextY-1;
      replaceSpot = passConvertCoordinates(this.xCoord,this.nextY);
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        this.nextY = 1;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "*");
      }
      if (mapLayout.charAt(replaceSpot) == 8) {this.sight="player"}
    }
    this.nextY = this.yCoord;
  }
  if (this.randomStore == 4) {
    //down
    this.facing = "bottom";
    while (this.nextY2 < 40) {
      this.nextY2 = this.nextY2+1;
      replaceSpot = passConvertCoordinates(this.xCoord,this.nextY2);
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        this.nextY2 = 40;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "*");
      }
      if (mapLayout.charAt(replaceSpot) == 8) {this.sight="player"}
    }
    this.nextY2 = this.yCoord;
  }
  $("span:nth-of-type("+spotSelector+")").css('border-'+this.facing, '5px solid black');
}

Robot.prototype.move = function() {


  this.currentSpot = passConvertCoordinates(this.xCoord,this.yCoord);

  var spotSelector = this.currentSpot+1;
  $("span:nth-of-type("+spotSelector+")").css('background', 'red');

  if (this.status == true) {
    if (this.yCoord < player1.yCoord) {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord+1)}
    if (this.yCoord > player1.yCoord) {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1)}
    if (mapLayout.charAt(this.nextSpot) == "_" || mapLayout.charAt(this.nextSpot) == "*") {
      mapLayout = mapLayout.replaceAt(this.currentSpot, "_");
      mapLayout = mapLayout.replaceAt(this.nextSpot, "!");
      this.currentSpot = this.nextSpot;
      this.nextSpot = "";
      if (this.yCoord < player1.yCoord) {
        this.yCoord = this.yCoord+1;
        this.facing = "bottom";
      }
      if (this.yCoord > player1.yCoord) {
        this.yCoord = this.yCoord-1;
        this.facing = "top";
      }
      else {this.yCoord = this.yCoord}
    } else {
      this.status = false;
    }
  }
  else {
    if (this.xCoord < player1.xCoord) {this.nextSpot = passConvertCoordinates(this.xCoord+1,this.yCoord)}
    if (this.xCoord > player1.xCoord) {this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord)}
    if (mapLayout.charAt(this.nextSpot) == "_" || mapLayout.charAt(this.nextSpot) == "*") {
      mapLayout = mapLayout.replaceAt(this.currentSpot, "_");
      mapLayout = mapLayout.replaceAt(this.nextSpot, "!");
      this.currentSpot = this.nextSpot;
      this.nextSpot = "";
      if (this.xCoord < player1.xCoord) {
        this.xCoord = this.xCoord+1;
        this.facing = "right";
      }
      if (this.xCoord > player1.xCoord) {
        this.xCoord = this.xCoord-1;
        this.facing = "left";
      }
      else {this.xCoord = this.xCoord}
    }
    else {
      this.status = true;
    }
  }

  var width = $(window).width();
  var height = $(window).height();

    $("span:nth-of-type("+spotSelector+")").css('border-'+this.facing, '10px solid black');



}

var bullets = [];
var bulletsNumber = 0;

function Bullet(xCoord, yCoord, facing) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.facing = facing;
  this.nextX = this.xCoord;
  this.nextY = this.yCoord-2;
  this.nextY2 = this.yCoord;
}

Bullet.prototype.changeX = function() {this.xCoord = player1.xCoord}
Bullet.prototype.changeY = function() {this.yCoord = player1.yCoord}
Bullet.prototype.changeFacing = function() {this.facing = player1.facing}

var moveCount = 0;

Player.prototype.shoot = function() {

  bullets[bulletsNumber] = new Bullet(this.xCoord, 2, "up");
  bullets[bulletsNumber].changeX();
  bullets[bulletsNumber].changeY();
  bullets[bulletsNumber].changeFacing();
  //bulletsNumber = bulletsNumber + 1;

  // console.log(bullets[0].xCoord);

  if (bullets[bulletsNumber].facing == "right") {

    while (bullets[bulletsNumber].nextX < 48) {

      bullets[0].nextX = bullets[bulletsNumber].nextX+1;
      replaceSpot = passConvertCoordinates(bullets[0].nextX,this.yCoord);
      replacePrevious = replaceSpot;
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        bullets[0].nextX = 48;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "b");
      }
      //console.log(replaceSpot+" "+robot1.currentSpot+" "+robot2.currentSpot+" "+robot3.currentSpot+" "+robot4.currentSpot);
      if (mapLayout.charAt(replaceSpot) == "!") {

        if (robot1.currentSpot == replaceSpot) {robot1.isFunctional = false;}
        if (robot2.currentSpot == replaceSpot) {robot2.isFunctional = false;}
        if (robot3.currentSpot == replaceSpot) {robot3.isFunctional = false;}
        if (robot4.currentSpot == replaceSpot) {robot4.isFunctional = false;}
      }
    }
    bullets[bulletsNumber].nextX = bullets[bulletsNumber].xCoord;
  }

  if (bullets[bulletsNumber].facing == "left") {

    while (bullets[bulletsNumber].nextX > 1) {
      //console.log(bullets[bulletsNumber].nextX-1);
      bullets[0].nextX = bullets[bulletsNumber].nextX-1;
      replaceSpot = passConvertCoordinates(bullets[0].nextX,this.yCoord);
      replacePrevious = replaceSpot;
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        bullets[0].nextX = 1;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "b");
      }
      if (mapLayout.charAt(replaceSpot) == "!") {
        if (robot1.currentSpot == replaceSpot) {robot1.isFunctional = false;}
        if (robot2.currentSpot == replaceSpot) {robot2.isFunctional = false;}
        if (robot3.currentSpot == replaceSpot) {robot3.isFunctional = false;}
        if (robot4.currentSpot == replaceSpot) {robot4.isFunctional = false;}
      }
    }
    bullets[bulletsNumber].nextX = bullets[bulletsNumber].xCoord;
  }

  // while (this.nextY2 < 40) {
  //   this.nextY2 = this.nextY2+1;

  if (bullets[bulletsNumber].facing == "up") {

    while (bullets[bulletsNumber].nextY < 40) {
      //console.log(bullets[bulletsNumber].nextX+1);
      bullets[0].nextY = bullets[bulletsNumber].nextY+1;
      replaceSpot = passConvertCoordinates(this.xCoord,bullets[0].nextY);
      replacePrevious = replaceSpot;
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        bullets[0].nextY = 40;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "b");
      }
      if (mapLayout.charAt(replaceSpot) == "!") {
        if (robot1.currentSpot == replaceSpot) {robot1.isFunctional = false;}
        if (robot2.currentSpot == replaceSpot) {robot2.isFunctional = false;}
        if (robot3.currentSpot == replaceSpot) {robot3.isFunctional = false;}
        if (robot4.currentSpot == replaceSpot) {robot4.isFunctional = false;}
      }
    }
    bullets[bulletsNumber].nextY = bullets[bulletsNumber].yCoord;
  }
  bullets[bulletsNumber].nextY = player1.yCoord;

  if (bullets[bulletsNumber].facing == "down") {
    //console.log(bullets[bulletsNumber].nextY);
    while (bullets[bulletsNumber].nextY > 1) {

      bullets[0].nextY = bullets[bulletsNumber].nextY+1;
      replaceSpot = passConvertCoordinates(this.xCoord,bullets[0].nextY);
      replacePrevious = replaceSpot;
      if (mapLayout.charAt(replaceSpot) !== "_" && mapLayout.charAt(replaceSpot) !== "*") {
        bullets[0].nextY = 1;
      }
      else {
        mapLayout = mapLayout.replaceAt(replaceSpot, "b");
      }
      if (mapLayout.charAt(replaceSpot) == "!") {
        if (robot1.currentSpot == replaceSpot) {robot1.isFunctional = false;}
        if (robot2.currentSpot == replaceSpot) {robot2.isFunctional = false;}
        if (robot3.currentSpot == replaceSpot) {robot3.isFunctional = false;}
        if (robot4.currentSpot == replaceSpot) {robot4.isFunctional = false;}
      }
    }
    bullets[bulletsNumber].nextY2 = bullets[bulletsNumber].yCoord;
  }

}

Player.prototype.checkForRobots = function() {
  if (mapLayout.charAt(passConvertCoordinates(this.xCoord,this.yCoord+1)) == "!" ||
      mapLayout.charAt(passConvertCoordinates(this.xCoord,this.yCoord-1)) == "!" ||
      mapLayout.charAt(passConvertCoordinates(this.xCoord+1,this.yCoord)) == "!" ||
      mapLayout.charAt(passConvertCoordinates(this.xCoord-1,this.yCoord)) == "!") {
    //console.log("game over");
    //game over
    $(".test").show();
    $(".test").html("Game Over");
    clearInterval(Game._intervalId);
  } else {
    $(".test").hide();
    $(".test").html("");
  }
}

Player.prototype.interact = function(interactWith) {

  if (interactWith == "talk") {


    //check if space where you are facing is a npc and if so then alert or w/e
    var way = player1.facing;

    if (way == "left") {this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord);}
    if (way == "up") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1);}
    if (way == "right") {this.nextSpot = passConvertCoordinates(this.xCoord+1,this.yCoord);}
    if (way == "down") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord+1);}
    if(mapLayout.charAt(this.nextSpot) == "&") {
      //hello
      player1.pause = true;
      talkToFolks(gameObjects.dudes[0]);
      $('#commHackWindow').show();
      $('#display').hide();
    }
    if(mapLayout.charAt(this.nextSpot) == "@") {
      //hello
      player1.pause = true;
      // clearInterval(Game._intervalId);
      var myKindOfTerminal = myTerminal ;
      showQuery(myKindOfTerminal);
      $('#display').hide();
      $('#commHackWindow').show();
      $('.panel').show();
      // $('#display').show();
    }
    // if(mapLayout.charAt(this.nextSpot) == "=") {
    //   //hello
    //   player1.pause = true;
    //   // clearInterval(Game._intervalId);
    //   var myKindOfTerminal = myTerminal ;
    //   showQuery(myKindOfTerminal);
    //   $('#display').hide();
    //   $('#commHackWindow').show();
    //   $('.panel').show();
    //   // $('#display').show();
    // }

  }
}

Player.prototype.move = function(way) {

  //collision detection
  if (way == "left") {this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord);}
  if (way == "up") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1);}
  if (way == "right") {this.nextSpot = passConvertCoordinates(this.xCoord+1,this.yCoord);}
  if (way == "down") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord+1);}
  //console.log(mapLayout.charAt(this.nextSpot));
  this.facing = way;

  this.currentSpot = passConvertCoordinates(this.xCoord,this.yCoord);
  if (way == "left") {
    this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord);
  }
  if (way == "up") {
    this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1);
  }
  if (way == "right") {
    this.nextSpot = passConvertCoordinates(this.xCoord+1,this.yCoord);
  }
  if (way == "down") {
    this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord+1);
  }

  if (mapLayout.charAt(this.nextSpot) !== "_" && mapLayout.charAt(this.nextSpot) !== "*" && mapLayout.charAt(this.nextSpot) !== "b") {
    this.nextSpot = "";
  }
  else {
    if (way == "left") {
      this.xCoord = this.xCoord-1;
    }
    if (way == "up") {
      this.yCoord = this.yCoord-1;
    }
    if (way == "right") {
      this.xCoord = this.xCoord+1;
    }
    if (way == "down") {
      this.yCoord = this.yCoord+1;
    }
    mapLayout = mapLayout.replaceAt(this.currentSpot, "_");
    mapLayout = mapLayout.replaceAt(this.nextSpot, "8");
    this.currentSpot = this.nextSpot;
    this.nextSpot = "";
    return this.currentSpot;
  }
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}



function cleanScreen() {
  var coords = 0;
  var matches = mapLayout.match(/(.*?)\!/g);
  for (i=0; i<matches.length; i++) {
    coords = coords+matches[i].length;
    var questionsMarkXCoord = getXConvertCoordinates(coords-1);
    var questionsMarkYCoord = getYConvertCoordinates(coords-1);
    //console.log(questionsMarkXCoord+" "+questionsMarkYCoord);

    //if x and y coordinates are equal to each robot coordinates
    if (questionsMarkXCoord == robot1.xCoord && questionsMarkYCoord == robot1.yCoord ||
        questionsMarkXCoord == robot2.xCoord && questionsMarkYCoord == robot2.yCoord ||
        questionsMarkXCoord == robot3.xCoord && questionsMarkYCoord == robot3.yCoord ||
        questionsMarkXCoord == robot4.xCoord && questionsMarkYCoord == robot4.yCoord) {} else {
          mapLayout = mapLayout.replaceAt(coords-1, "_");
        }

  }
  mapLayout = mapLayout.replace(/b/g, '_');
}


var moveCount = 0;
function drawScreen() {

  var map1Layout = mapLayout;

  map1Layout = map1Layout.replace(/_/g, 'o')
    .replace(/\[\]/g, 'cc')
    .replace(/8/g, 'p')
    .replace(/&/g, 'n')
    .replace(/@/g, 't')
    .replace(/=/g, 'd')
    .replace(/!/g, 'r')
    .replace(/\*/g, 's');

    // console.log(map1Layout);

  $("#display").html("");
  //draw the screen
  var character = 0;
  for (var i = 0; i < 42; i++) {
    //row
    for (var x = 0; x < 50; x++) {

      if (map1Layout.charAt(character) == "p") {
        $("#display").append("<span class='"+map1Layout.charAt(character)+" "+player1.facing+" pixels'>"+"</span>");
      }
      else {
        $("#display").append("<span class='"+map1Layout.charAt(character)+" pixels'>"+"</span>");
       }
        character++;
    }
    $("#display").append("<br>");
  }
    if (player1.pause == false) {
      if (player1.disableAllRobots !== true) {
        player1.checkForRobots();
        if (robot1.isFunctional == true) {
          if (robot1.sight !== "player") {robot1.checkForPlayers()}
          else {
            if (moveCount == 2) {
              robot1.move()
            }
          }
        }
        if (robot2.isFunctional == true) {
          if (robot2.sight !== "player") {robot2.checkForPlayers()}
          else {
            if (moveCount == 2) {
              robot2.move()
            }
          }
        }
        if (robot3.isFunctional == true) {
          if (robot3.sight !== "player") {robot3.checkForPlayers()}
          else {
            if (moveCount == 2) {
              robot3.move()
            }
          }
        }
        if (robot4.isFunctional == true) {
          if (robot4.sight !== "player") {robot4.checkForPlayers()}
          else {
            if (moveCount == 2) {
              robot4.move()
            }
          }
        }
        if (moveCount == 2) {
          moveCount = 0;
        }
        moveCount++;
      }
    }
}

function getXConvertCoordinates(longCoord) {
  var y = Math.floor(longCoord/50);
  var x = longCoord - (y * 50);
  //console.log("x: "+x+" "+"y: "+y);
  return x;
}

function getYConvertCoordinates(longCoord) {
  var y = Math.floor(longCoord/50);
  var x = longCoord - (y * 50);
  //console.log("x: "+x+" "+"y: "+y);
  return y;
}

function passConvertCoordinates(xcoord,ycoord) {
  var y = ycoord * 50;
  return xcoord+y;
}

var Game = {};

if (player1.pause == true) {Game.fps = 0; console.log("0")}
else {Game.fps = 60;}


Game.run = function() {
  drawScreen();
  cleanScreen();
};

var change = {
  37: {
    left: "-=1"
  },

  38: {
    top: "-=1"
  },

  39: {
    left: "+=1"
  },

  40: {
    top: "+=1"
  },
}
$(document).on({
  keydown: keydown,
  keyup: keyup
})

var movement = []

function keydown(e) {
  var key = e.which
  var animation = change[key];
  if (!movement[key]) { // watch out for repeating keys!
      movement[key] = setInterval(keepGoing)

  }
  //  console.log("down", key, movement[key])
  function keepGoing() {
    //console.log(animation)
    if (player1.pause == false) {
      if (key == 37) {player1.move("left")}
      if (key == 38) {player1.move("up")}
      if (key == 39) {player1.move("right")}
      if (key == 40) {player1.move("down")}
      if (key == 84) {player1.interact("talk")}

  }

  }
}

function keyup(e) {
  var key = e.which
  movement[key] = clearInterval(movement[key]);
  if (player1.pause == false) {
    if (key == 32) {player1.shoot()}
  }
}
//-------------------
//room code end
//-------------------

$(document).ready(function() {
  $("#startButton").click(function(event){
    event.preventDefault();
    $("#titleScreen").hide();
    startShipGame();
    // Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
    // above code run room program

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
