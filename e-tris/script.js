var Game = function(){
  var contentWidth = 10;
  var contentHeight = 20;
  var boxWidth = 20;
  var boxHeight = 20;
  var timeout;
  var currentShape;
  var boxes = [];
  var points = 0;
  var running = false;
  var paused = false;
  var Shape = function(myBoxes, color){
    return {
      offsetX: 0,
      offsetY: -1,
      rotate: function(){
        myBoxes = [myBoxes[2], myBoxes[5], myBoxes[8], myBoxes[1], myBoxes[4], 
                   myBoxes[7], myBoxes[0], myBoxes[3], myBoxes[6]];
        if(this.checkForCollision()){
          myBoxes = [myBoxes[6], myBoxes[3], myBoxes[0], myBoxes[7], myBoxes[4], 
                     myBoxes[1], myBoxes[8], myBoxes[5], myBoxes[2]];
        }
      },
      fall: function(){
        this.offsetY++;
        if(this.checkForCollision()){
          this.offsetY--;
          this.stop();
        }
      },
      stop: function(){
        var i;
        var w;
        var h;
        for(i in myBoxes){
          if(myBoxes.hasOwnProperty(i)){
            if(myBoxes[i]){
              w = this.getW(i);
              h = this.getH(i);
              if(boxes[h][w] !== undefined){
                endGame();
              }
              boxes[h][w] = new Box(w, h, color);
            }
          }
        }
        changeShape();
      },
      moveRight: function(){
        this.offsetX++;
        if(this.checkForCollision()){
          this.offsetX--;
        }
      },
      moveLeft: function(){
        this.offsetX--;
        if(this.checkForCollision()){
          this.offsetX++;
        }
      },
      getH: function(i){
        return (Math.floor(i/3)+this.offsetY);
      },
      getW: function(i){
        return i%3+this.offsetX;
      },
      draw: function(ctx){
        var i;
        var w;
        var h;
        ctx.save();
        ctx.fillStyle = color;
        for(i in myBoxes){
          if(myBoxes.hasOwnProperty(i) && myBoxes[i] ){
              w = this.getW(i);
              h = this.getH(i);
              ctx.globalAlpha = 0.7;
              ctx.fillRect(w*boxWidth+w, h*boxHeight+h, boxWidth, boxHeight);
              ctx.globalAlpha = 0.7;
              ctx.strokeRect(w*boxWidth+w+2, h*boxHeight+h+2, boxWidth-3, boxHeight-3);
          }
        }
        ctx.restore();
      },
      checkForCollision: function(){
        var i;
        var w;
        var h;
        for(i in myBoxes){
          if(myBoxes.hasOwnProperty(i) && myBoxes[i]){
            w = this.getW(i);
            h = this.getH(i);
            if(h >= 0){
              if(w < 0 || w >= contentWidth){ return true;}
              if(h >= contentHeight || boxes[h][w] !== undefined){ return true;}
            }
          }
        }
        return false;
      }
    };
  };
  var getShape = function(){
    var shape;
    switch(Math.floor(Math.random()*7)){
      case 0: 
        shape = new Shape([1, 1, 1, 1], 'maroon');
        shape.isTilted = false;
        shape.rotate = function(){
          shape.isTilted = !shape.isTilted;
        };
        shape.getH = function(i){
          return shape.isTilted? shape.offsetY+1: Number(i)+shape.offsetY;
        };
        shape.getW = function(i){
          return shape.isTilted? Number(i)+shape.offsetX-1: this.offsetX;
        };
        shape.offsetX = 1;
        return shape;
      case 1: return new Shape([0, 0, 0, 1, 1, 1, 0, 0, 1], 'white');
      case 2: return new Shape([0, 0, 0, 0, 0, 1, 1, 1, 1], 'magenta');
      case 3:
        shape = new Shape([0, 0, 0, 0, 1, 1, 0, 1, 1], 'dark blue');
        shape.rotate = function(){};
        return shape;
      case 4: return new Shape([0, 0, 0, 0, 1, 1, 1, 1, 0], 'green');
      case 5: return new Shape([0, 0, 0, 0, 1, 0, 1, 1, 1], 'brown');
      case 6: return new Shape([0, 0, 0, 1, 1, 0, 0, 1, 1], 'cyan');
    }
  };
  var nextShape = getShape();
  var sidepanel = document.createElement('div');
  var bottom = document.createElement('div');
  var gameCanvas = document.createElement('canvas');
  var nextCanvas = document.createElement('canvas');
  var ctx = gameCanvas.getContext('2d');
  var nctx = nextCanvas.getContext('2d');
  var pointsContainer = document.createElement('div');
  var setPoints = function(p){
    points = p;
    while (pointsContainer.childNodes.length >= 1){
      pointsContainer.removeChild(pointsContainer.firstChild);
    }
    pointsContainer.appendChild(document.createTextNode(points +'p'));
  };
  var startGame = function(){
    var h = 0;
    var w = 0;
    running = true;
    for(h = 0; h < contentHeight; h++){
      boxes[h] = [];
      for(w = 0; w < contentWidth; w++){
        boxes[h][w] = undefined;
      }
    }
    setPoints(0);
    changeShape();
    redraw();
  };
  var setNewTimeout = function(t){
    window.clearTimeout(timeout);
    timeout = setInterval(function(){currentShape.fall();redraw();}, t);
  };
  var changeShape = function(){
    var p = 1;
    if(running){
      setNewTimeout(1000-points);
      while(checkRows(p)){
        p+=1;
      }
      currentShape = nextShape;
      currentShape.offsetX = 4;
      nextShape = getShape();
      redraw();
    }
  };
  var pause = function(){
    window.clearTimeout(timeout);
    paused = true;
    redraw();
  };
  var unpause = function(){  
    paused = false;
    currentShape.fall();
    redraw();
    setNewTimeout(1000);
  };

  var endGame = function(){
    setPoints(points);
    pointsContainer.appendChild(document.createElement('br'));
    pointsContainer.appendChild(document.createTextNode('Game over'));
    window.clearTimeout(timeout);
    running = false;
  };
  
  /**
   * Check all rows and removes the first row (from the top) that has been fully
   * filled with blocks. Return true if such row has been removed
   *@arg n is the number of points that the the player should be awarded with
   *       when removing a row
   */
  var checkRows = function(n){
    var h;
    var fun = function(i){ return i === undefined;}; 
    for(h in boxes){
      if(boxes.hasOwnProperty(h) && boxes[h].filter(fun).length <= 0){
        removeRow(h,n);
        return true;
      }
    }
  };
  var removeRow = function(row,p){
    var h;
    var w;
    for(h = row; h > 0; h--){
      boxes[h] = boxes[h-1];
      for(w = 0; w < contentWidth; w++){
        if(boxes[h][w] !== undefined){
          boxes[h][w].moveDown();
        }
      }
    }
    boxes[0] = [];
    for(w = 0; w < contentWidth; w++){
      boxes[0][w] = undefined;
    }
    setPoints(points+p);
  };
  var Box = function(w, h, color){
    return {
      drawBox: function(ctx){
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(w*boxWidth+w, h*boxHeight+h, boxWidth, boxHeight);
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(w*boxWidth+w+2, h*boxHeight+h+2, boxWidth-3, boxHeight-3);
        ctx.restore();
      },
      getColor: function(){
        return color;
      },
      moveDown: function(){
        h++;
      }
    };
  };
  var drawBackground =  function(ctx, width, height){
    var w;
    var h;
    ctx.save();
    ctx.fillStyle = 'rgba(50,50,50,0.5)';
    for(w = 0; w < width; w++){
      for(h = 0; h < height; h++){
        ctx.fillRect(w*boxWidth+w, h*boxHeight+h, boxWidth, boxHeight);
      }
    }
    ctx.restore();
  };
  var redraw = function(){ 
    var ctx = gameCanvas.getContext('2d');
    var nctx = nextCanvas.getContext('2d');
    var w;
    var h;
    clear(ctx, gameCanvas.width, gameCanvas.height);
    clear(nctx, nextCanvas.width, nextCanvas.height);
    drawBackground(ctx, contentWidth, contentHeight);
    drawBackground(nctx, 4, 4);
    nextShape.draw(nctx);
    
    for(w in boxes){
      if(boxes.hasOwnProperty(w)){
        var o = boxes[w];
        for(h in o){
          if(o[h] !== undefined){
            o[h].drawBox(ctx);
          }
        }
      }
    }
    if(running){
      currentShape.draw(ctx);
      if(paused){
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText('Appuyez \'p\' pour continuer', 10, 140);
      }
    }else{
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillText('C\'est perdu !', 50, 150);

    }
  };
  var clear = function(ctx, width, height){
    ctx.clearRect(0,0,width,height);
  };
// magic

  gameCanvas.width = contentWidth*boxWidth+contentWidth-1;
  gameCanvas.height = contentHeight*boxHeight+contentHeight-1;
  nextCanvas.width = boxWidth*4+4-1;
  nextCanvas.height = boxHeight*4+4-1;

  drawBackground(ctx, contentWidth, contentHeight);
  drawBackground(nctx, 4, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.font         = 'bold 12px sans-serif';
  ctx.fillText('Appuyez sur \'s\' pour jouer', 10, 140);
  pointsContainer.appendChild(document.createElement('br'));
  pointsContainer.setAttribute('id', 'points');
  sidepanel.setAttribute('id', 'sidepanel');
  bottom.setAttribute('id', 'bottom');
  sidepanel.appendChild(document.createTextNode('Forme suivante : '));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(nextCanvas);
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(pointsContainer);
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('s pour commencer'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('← pour déplacer la pièce à gauche'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('→ pour déplacer la pièce à droite'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('↑ pour tourner la pièce'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('↓ pour augmenter la vitesse de chute'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('r pour recommencer'));
  sidepanel.appendChild(document.createElement('br'));
  sidepanel.appendChild(document.createTextNode('p pour mettre en pause'));
  sidepanel.appendChild(document.createElement('br'));
  bottom.appendChild(document.createTextNode('Le nombre de points obtenu augmente lorsque plusieurs lignes sont supprimées à la fois. Une ligne génère un point mais quatre lignes génèrent un total de dix points.'));
  
  document.body.appendChild(gameCanvas);
  document.body.appendChild(sidepanel);
  document.body.appendChild(bottom);
//return
  return {
    keyHandler: function(e){
      if(e.which === 82){ // 'r'
        endGame();
        startGame();
      } else if(running && !paused){
        switch(e.which){
          case 39: //right
            currentShape.moveRight();
            redraw();
            break;
          case 37: //left
            currentShape.moveLeft();
            redraw();
            break;
          case 40: //down
            setNewTimeout(50); 
            break;
          case 38: // up
            currentShape.rotate();
            redraw();
            break;
          case 80: // 'p'
            pause();
            break;
        }
      } else if(running && paused && e.which === 80){ // 'p'
        unpause();
      } else if(!running && e.which === 83){ // 's'
        startGame();
      }
    },
    onblur: function(e){
      if(running && !paused){
        pause();
      }
    }
  };
};

window.onload = function(){
  var g = new Game();
  document.onkeydown = g.keyHandler;
  document.body.onblur = g.onblur;
};

