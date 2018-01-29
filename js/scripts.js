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
'x________________________________________________x'+
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

//pass the coordinates to the converter to get the actual spot
//then we will pass the corodinates on all 4 sides and check if they are valid spots
//if they are valid spots then move that symbol to that spot and remove its old spot

var player1 = new Player(18,40);


Player.prototype.move = function(way) {
  //get current spot
  this.currentSpot = passConvertCoordinates(this.xCoord,this.yCoord);

  if (way == "left") {this.nextSpot = passConvertCoordinates(this.xCoord-1,this.yCoord)}
  if (way == "top") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord+1)}
  if (way == "right") {this.nextSpot = passConvertCoordinates(this.xCoord+1,this.yCoord)}
  if (way == "bottom") {this.nextSpot = passConvertCoordinates(this.xCoord,this.yCoord-1)}
}


console.log(player1);

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
