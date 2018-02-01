
var gameObjects = {
  playerShip: '',
  landingPads: [],
  mapBuildings: [],
  backgroundBuildings: [],
  gameWindow: '',
};


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
    $(this.canvas).fadeOut(3000);
    function removeSideScroll() {
    $('#sideScrollWindow').html('');
    window.removeEventListener('keydown', function(){});
    window.removeEventListener('keyup', function(){});
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
    // gameObjects.backgroundBuildings.push(new component(70, (height - 350), "#666", x,y))
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
  // console.log(gameObjects.gameWindow.frameNo);
}

function everyinterval(n) {
  if ((gameObjects.gameWindow.frameNo / n) % 1 == 0) {return true;}
  return false;
}

$(document).ready(function() {
  $("#startButton").click(function(event){
    event.preventDefault();
    $("#titleScreen").hide();
    startShipGame();
  });
})
