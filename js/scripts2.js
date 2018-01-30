var mapLayout = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+
'x________________________________________________x'+
'x________________________@_______________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x_________[]_______________________________[]____x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x____!___________________________________________x'+
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
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
'x________________________________________________x'+
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
}

var player1 = new Player(18,40, "down");

Player.prototype.interact = function(interactWith) {
  if (interactWith == "talk") {
    //check if spaces near are interactable

    console.log(this.facing);
  }
}

Player.prototype.move = function(way) {
  //collision detection

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

  if (mapLayout.charAt(this.nextSpot) !== "_") {
    if (mapLayout.charAt(this.nextSpot) == "&") {console.log("hello")}
    else {
    this.nextSpot = "";
    }
  }
  else {
    if (way == "left") {
      this.xCoord = this.xCoord-1;
      //console.log("left");
    }
    if (way == "up") {
      this.yCoord = this.yCoord-1;
      //console.log("up");
    }
    if (way == "right") {
      this.xCoord = this.xCoord+1;
      //console.log("right");
    }
    if (way == "down") {
      this.yCoord = this.yCoord+1;
      //console.log("down");
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

function drawScreen() {

  var map1Layout = mapLayout;

  map1Layout = map1Layout.replace(/_/g, 'o')
    .replace(/\[\]/g, 'cc')
    .replace(/8/g, 'p')
    .replace(/&/g, 'n')
    .replace(/@/g, 't')
    .replace(/=/g, 'd')
    .replace(/!/g, 'r')
    ;

    // console.log(map1Layout);

  $("#display").html("");
  //draw the screen
  var character = 0;
  for (var i = 0; i < 42; i++) {
    //row
    for (var x = 0; x < 50; x++) {

      if (map1Layout.charAt(character) == "p") {
        $("#display").append("<span class='"+map1Layout.charAt(character)+" "+player1.facing+" pixels'>"+"</span>");
        console.log(player1.facing);
      }
      else {
        $("#display").append("<span class='"+map1Layout.charAt(character)+" pixels'>"+"</span>");
       }
        character++;
    }
    $("#display").append("<br>");
  }
}

function getConvertCoordinates(longCoord) {
  var y = Math.floor(longCoord/50);
  var x = longCoord - (y * 50);
  return y;
}

function passConvertCoordinates(xcoord,ycoord) {
  var y = ycoord * 50;
  return xcoord+y;
}

var Game = {};

Game.fps = 30;

Game.run = function() {
  drawScreen();
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
    if (key == 37) {player1.move("left");}
    if (key == 38) {player1.move("up");}
    if (key == 39) {player1.move("right");}
    if (key == 40) {player1.move("down");}
    if (key == 84) {player1.interact("talk");}
  }
}

function keyup(e) {
  var key = e.which
  movement[key] = clearInterval(movement[key])
}

$(document).ready(function() {

  Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

})
