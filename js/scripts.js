var map1Layout = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+
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

function Player(xCoord, yCoord) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.currentSpot = 2018;
  this.nextSpot = "";
}

var player1 = new Player(18,40);

Player.prototype.move = function(way) {
  //collision detection

  this.currentSpot = passConvertCoordinates(this.xCoord,this.yCoord);
  if (way == "left") {
    this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord);
  }
  if (way == "up") {
    this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1);
  }
  if (way == "right") {this.nextSpot = passConvertCoordinates(
    this.xCoord+1,this.yCoord);

  }
  if (way == "down") {this.nextSpot = passConvertCoordinates(
    this.xCoord,this.yCoord+1);
  }

  if (map1Layout.charAt(this.nextSpot) !== "_") {
    if (map1Layout.charAt(this.nextSpot) == "&") {alert("hello")}
    else {
    this.nextSpot = "";
    }
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
    map1Layout = map1Layout.replaceAt(this.currentSpot, "_");
    map1Layout = map1Layout.replaceAt(this.nextSpot, "8");
    this.currentSpot = this.nextSpot;
    this.nextSpot = "";
    return this.currentSpot;
  }
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function drawScreen() {
  $("#display").html("");
  //draw the screen
  var character = 0;
  for (var i = 0; i < 42; i++) {
    //row
    for (var x = 0; x < 50; x++) {
      $("#display").append(map1Layout.charAt(character));
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

$(document).keydown(function(e){
    if (e.keyCode == 37) {
       player1.move("left");
       return false;
    }
    if (e.keyCode == 38) {
       player1.move("up");
       return false;
    }
    if (e.keyCode == 39) {
       player1.move("right");
       return false;
    }
    if (e.keyCode == 40) {
       player1.move("down");
       return false;
    }
});

$(document).ready(function() {

  Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

})
