
var playerShip;
var landingPads = [];
var mapBuildings = [];
var backgroundBuildings = [];


function startShipGame() {
  playerShip = new component(60, 40, "img/ship.gif", 10, 10, "image");
  gameWindow.start();
}

var gameWindow = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = 750;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      $('#sideScrollWindow').append(this.canvas);
      $(this.canvas).attr('id', 'cityCanvas');
      window.addEventListener('keydown', function (e) {
          gameWindow.keys = (gameWindow.keys || []);
          gameWindow.keys[e.keyCode] = true;
      })
      window.addEventListener('keyup', function (e) {
          gameWindow.keys[e.keyCode] = false;
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
    $(this.canvas).fadeOut(3000);
    function removeSideScroll() {
      $('#sideScrollWindow').html('');
    }
    setTimeout(removeSideScroll, 3000);
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
      ctx = gameWindow.context;
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
    var bottom = gameWindow.canvas.height - this.height;
    var top = 0;
    var left = 0;
    var right = gameWindow.canvas.width - this.width;
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
  for (i = 0; i < mapBuildings.length; i += 1) {
    if (playerShip.crashWith(mapBuildings[i])) {
        gameWindow.stop();
        return;
    }
  }
  for (i = 0; i < landingPads.length; i += 1) {
    if (playerShip.crashWith(landingPads[i])) {
        gameWindow.land();
        return;
    }
  }
  gameWindow.clear();
  gameWindow.frameNo += 1;
  if (gameWindow.frameNo == 1 || everyinterval(interval * 30)) {
    x = gameWindow.canvas.width;
    y = gameWindow.canvas.height

    landingPads.push(new component(80, 220, "img/building3.png", x, y - 220, "image"));
  }
  if (gameWindow.frameNo == 1 || everyinterval(interval)) {
    x = gameWindow.canvas.width;
    y = gameWindow.canvas.height
    height = 80;
    minHeight = 10;
    maxHeight = 210;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    mapBuildings.push(new component(100, height + 30, "img/building1.png", x - 30, y - height, "image"));
    // backgroundBuildings.push(new component(70, (height - 350), "#666", x,y))
  }

  for (i = 0; i < landingPads.length; i += 1) {
      landingPads[i].x += -4;
      landingPads[i].update();
  }
  for (i = 0; i < backgroundBuildings.length; i += 1) {
      backgroundBuildings[i].x += -2;
      backgroundBuildings[i].update();
  }
  for (i = 0; i < mapBuildings.length; i += 1) {
      mapBuildings[i].x += -4;
      mapBuildings[i].update();
  }
  playerShip.speedX = 0;
  playerShip.speedY = 0;
  if (gameWindow.keys && gameWindow.keys[65]) {playerShip.speedX = -5; }
  if (gameWindow.keys && gameWindow.keys[68]) {playerShip.speedX = 5; }
  if (gameWindow.keys && gameWindow.keys[87]) {playerShip.speedY = -5; }
  if (gameWindow.keys && gameWindow.keys[83]) {playerShip.speedY = 5; }
  playerShip.newPos();
  playerShip.update();
  // console.log(gameWindow.frameNo);
}

function everyinterval(n) {
  if ((gameWindow.frameNo / n) % 1 == 0) {return true;}
  return false;
}

$(document).ready(function() {

$("#click").click(function(event){
  event.preventDefault();
  $("#titleScreen").hide();
  startShipGame();
});
})
