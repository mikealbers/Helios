
var playerShip;
var mapBuildings = [];
var landingPads = [];

function startShipGame() {
    playerShip = new component(30, 10, "blue", 10, 10);
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

    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameWindow.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
    // this.landWith = function (otherobj) {
    //   var myleft = this.x;
    //   var myright = this.x + (this.width);
    //   var mytop = this.y;
    //   var mybottom = this.y + (this.height);
    //   var otherleft = otherobj.x;
    //   var otherright = otherobj.x + (otherobj.width);
    //   var othertop = otherobj.y;
    //   var otherbottom = otherobj.y + (otherobj.height);
    //   var land = true;
    //   if (mybottom < othertop) {
    //     land = false;
    //   }
    //   return land;
    // }
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
    var interval = Math.floor(Math.random() * 1.2);

    for (i = 0; i < mapBuildings.length; i += 1) {
        // if (playerShip.landWith(mapBuildings[i])) {
        //     gameWindow.enterBuilding();
        // } else
        if (playerShip.crashWith(mapBuildings[i])) {
            gameWindow.stop();
            return;
        }
    }
    gameWindow.clear();
    gameWindow.frameNo += 1;
    if (gameWindow.frameNo == 1 || everyinterval(interval)) {
        x = gameWindow.canvas.width;
        y = gameWindow.canvas.height
        height = 80;
        minHeight = 10;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        mapBuildings.push(new component(50, height, "#aaa", x, y - height));
        landingPads.push(new component(70, (height - 350), "#666", x,y))


    }
    for (i = 0; i < landingPads.length; i += 1) {
        landingPads[i].x += -3;
        landingPads[i].update();
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
    console.log(gameWindow.frameNo);
}

function everyinterval(n) {
    if ((gameWindow.frameNo / n) % 1 == 0) {return true;}
    return false;
}

$(document).ready(function() {
  startShipGame();
})
