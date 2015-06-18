/*
 * Copyright (c) 2011 Emin KURA (http://eminkura.com)
 *
 * Licensed under the MIT (http://eminkura.com/license.html) license.
 */
var game = null;
var gameSize = 500;

window.onload = function(){
    init();
}

window.onclick = function(event){
    var x = event.pageX;
    var y = event.pageY;
    // alert(event.pageX + " "+event.pageY);
    game.onclick(x,y);
}

window.onmousemove = function(event){
    var x = event.pageX;
    var y = event.pageY;
    // alert(event.pageX + " "+event.pageY);
    game.onmouseout(x,y);
    game.onmouseover(x,y);
}


function init(){
    game = new GameCanvas(gameSize,gameSize);
    game.bgColor = "#fffa99";
    game.drawBackground();
    game.update();
	
    initHtml();
	
}

function resetGame(){
    game.clear();
    game = new GameCanvas(gameSize,gameSize);
    game.bgColor = "#fffa99";
    game.drawBackground();
    game.update();
}

function  initHtml(){
 
    var infoDiv = document.getElementById("info");
    infoDiv.style.position ="fixed  ";
    infoDiv.style.top = "20px";
    infoDiv.style.right = "20px";
    
    document.body.appendChild(infoDiv);
    var size = document.getElementById("size");
    size.style.outline = "none";
    size.onchange = function(){
        if(size.value > 1000){
            if(window.confirm("This size can cause to some performance issues. Do you want to continue?")){
                gameSize = size.value;
                resetGame();
            }
                
        }else{
            gameSize = size.value;
            resetGame();
        }
    }

}




