/*
 * Copyright (c) 2011 Emin KURA (http://eminkura.com)
 *
 * Licensed under the MIT (http://eminkura.com/license.html) license.
 */

function GameCanvas (width, height) {

    this.width = width  ;
    this.height = height ;
    this.bgColor = "#f00";

    this.canvas = new Raphael(0,0,this.width+100, this.height+100);
    this.gameArray = [
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [1,1,1,2,1,1,1],
    [1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0]
    ];

    this.deckArray = null;

    GameCanvas.prototype.init = function() {
        this.deckArray = new Array;
        var deckSize = this.width/14 - 2,xPos, yPos;
        xPos = deckSize + 20;
        yPos = deckSize + 20;
        for(var i = 0; i < this.gameArray.length; i++) {
            this.deckArray[i] = new Array;
            for(var j = 0; j < this.gameArray[i].length; j++) {
                this.deckArray[i][j] = new Deck(xPos,yPos,deckSize,this.gameArray[i][j],i,j,this.bgColor,this.canvas);
                xPos += deckSize * 2 + 5;
            }
            xPos = deckSize + 20;
            yPos += deckSize * 2 + 5 ;
        }

    }
    GameCanvas.prototype.update = function() {
        if(this.deckArray == null) {
            this.init();
        }
        for(var i = 0; i < this.deckArray.length; i++) {
            for(var j = 0; j < this.deckArray[i].length; j++) {
                this.deckArray[i][j].draw();
            }

        }
    }
    
    GameCanvas.prototype.clear = function(){
        this.canvas.clear();
    }
    
    GameCanvas.prototype.getSelected = function() {
        for(var i = 0; i < this.deckArray.length; i++) {
            for(var j = 0; j < this.deckArray[i].length; j++) {
                if(this.deckArray[i][j].isSelected()) {
                    return this.deckArray[i][j];
                }
            }
        }
        return null;
    }
    GameCanvas.prototype.changeDecks = function(selectedI,selectedJ,removeI,removeJ,i,j) {
        // setting array values
        this.gameArray[selectedI][selectedJ] = 2;
        this.gameArray[removeI][removeJ] = 2;
        this.gameArray[i][j] = 1;
        // setting selected state
        this.deckArray[selectedI][selectedJ].setSelected(false);
        this.deckArray[removeI][removeJ].setSelected(false);
        this.deckArray[i][j].setSelected(false);
        //setting values
        this.deckArray[selectedI][selectedJ].setValue(2);
        this.deckArray[removeI][removeJ].setValue(2);
        this.deckArray[i][j].setValue(1);
        //redraw
        this.deckArray[selectedI][selectedJ].draw();
        this.deckArray[removeI][removeJ].drawAnimated(this.width+150,this.width+150);
        this.deckArray[i][j].drawAnimated(this.deckArray[selectedI][selectedJ].x,this.deckArray[selectedI][selectedJ].y);
    }
    GameCanvas.prototype.onmouseover = function(x,y) {
        for(var i = 0; i < this.deckArray.length; i++) {
            for(var j = 0; j < this.deckArray[i].length; j++) {
                if(this.deckArray[i][j].collides(x,y)) {
                    this.deckArray[i][j].onmouseover();
                }
            }
        }
    }
	
    GameCanvas.prototype.onmouseout = function(x,y) {
        for(var i = 0; i < this.deckArray.length; i++) {
            for(var j = 0; j < this.deckArray[i].length; j++) {
                if(!this.deckArray[i][j].collides(x,y)) {
                    this.deckArray[i][j].onmouseout();
                }
            }
        }
    }
	
    GameCanvas.prototype.onclick = function(x,y) {

        var selectedDeck = this.getSelected();

        for(var i = 0; i < this.deckArray.length; i++) {
            for(var j = 0; j < this.deckArray[i].length; j++) {
                if(this.deckArray[i][j].collides(x,y)) {
                    this.deckArray[i][j].onclick(x,y);
                    if(this.gameArray[i][j] == 2) {
                        if(selectedDeck != null) {
                            var selectedI = selectedDeck.i;
                            var selectedJ = selectedDeck.j;
                            if(selectedI == i) {
                                //vertical move
                                if((selectedJ == j - 2 || selectedJ == j + 2)) {
                                    
                                    if(selectedJ == j-2){
                                        if(this.gameArray[i][j-1] != 1){
                                            return;
                                        }
                                    }else if(selectedJ == j + 2){
                                        if(this.gameArray[i][j+1] != 1){
                                            return;
                                        }
                                    }
                                    
                                    //to remove deck
                                    var removeI, removeJ;
                                    if(selectedJ == j - 2) {
                                        removeJ = j - 1;
                                        removeI = i;
                                    } else {
                                        removeJ = j + 1;
                                        removeI = i;
                                    }
                                    this.changeDecks(selectedI, selectedJ,removeI,removeJ,i,j);
                                }
                            } else if(selectedJ == j) {
                                //horizontal move
                                if((selectedI == i - 2 || selectedI == i + 2)){
                                    
                                    if(selectedI == i-2){
                                        if(this.gameArray[i-1][j] != 1){
                                            return;
                                        }
                                    }else if(selectedI == i + 2){
                                        if(this.gameArray[i+1][j] != 1){
                                            return;
                                        }
                                    }
                                    
                                    //to remove deck
                                    var removeI, removeJ;
                                    if(selectedI == i - 2) {
                                        removeI = i - 1;
                                        removeJ = j;
                                    } else {
                                        removeI = i + 1;
                                        removeJ = j;
                                    }
                                    this.changeDecks(selectedI, selectedJ,removeI,removeJ,i,j);
                                }
                            }
                        }
                    }
                } else {
                    this.deckArray[i][j].setSelected(false);
                }
            }

        }
    }
    GameCanvas.prototype.drawBackground = function() {

        var circle = this.canvas.circle(this.width/2 + 20, this.height/2 + 20, this.width/2 + 15);

        circle.attr("fill", this.bgColor);

        circle.attr("stroke", "#000000");
        circle.attr("stroke-linecap","round");
        circle.attr("stroke-width", 2);

    }
}
function Deck(x,y,radius,value,i,j,bgColor,canvas) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.bgColor = bgColor;
    this.radius = radius;
    this.value = value;
    this.deckColor = "r#3C93C9-#126294";
    this.deckColorH = "r#C46A6A-#A64444";
    this.selected = false;
    this.mouseover = false;
    this.setValue = function(newValue) {
        this.value = newValue;
    }
	
    this.setSelected = function(selected) {
        if(this.value == 1 && selected != this.selected) {
            this.selected = selected;
            this.drawSelected();
        }
    }
    this.isSelected = function() {
        return this.selected ;
    }
    this.paintComponent = function(circle) {
		
        if(this.value == 1) {

            if(this.selected) {

                circle.attr("stroke", "#19191A");
                circle.attr("stroke-linecap","round");
                circle.attr("stroke-width",2);
                circle.attr("fill", this.deckColorH);

            } else {
                circle.attr("stroke", "#19191A");
                circle.attr("fill", this.deckColor);
                circle.attr("stroke-linecap","round");
                circle.attr("stroke-width",2);
		
            }
        } else if (this.value == 2) {
            var tempCircle = this.canvas.circle(this.x, this.y, this.radius);
            tempCircle.attr("fill",this.bgColor);
            circle = this.canvas.circle(this.x, this.y, this.radius);
            circle.attr("stroke", "#000000");
            circle.attr("stroke-linecap","round");
            circle.attr("stroke-width",1);
            circle.attr("fill", "#000000");
            circle.attr("opacity",0.2);
			
        }
    }
    this.draw = function() {
        if(this.value != 0) {
            var circle = this.canvas.circle(this.x, this.y, this.radius);

            this.paintComponent(circle);
        }
    }
	
    this.drawSelected = function() {
        if(this.value != 0) {
            var circle = this.canvas.circle(this.x, this.y, this.radius);

            this.paintComponent(circle);
			
        // if(this.selected) {
        // circle.attr("fill",this.deckColor);
        // circle.animate({
        // fill: this.deckColorH,
        // stroke: "#19191A"
        // },500);
        // 
        // } else {
        // circle.attr("fill",this.deckColorH);
        // circle.animate({
        // fill: this.deckColor,
        // stroke: "#19191A"
        // },500);
        // }
        }
    }
	
    this.drawOver = function(over) {
		
        if(this.value == 0)
            return;
		
        var circle = this.canvas.circle(this.x, this.y, this.radius);
			
        this.paintComponent(circle);
			
        if(this.value == 1) {
			
            if(!this.selected) {
                if(over) {
                    circle.animate({
                        stroke: "#FFFFFF"
                    },200);
                } else {
                    circle.animate({
                        stroke: "#19191A"
                    },200);
                }
            }
        } 

    }
	
    this.drawAnimated = function(x,y) {
        var circle = null;
        if(this.value == 1) {
            circle = this.canvas.circle(x, y, this.radius);
            this.paintComponent(circle);
					
            circle.toFront(); // draw on top of the screen

            circle.animate({
                cx: this.x ,
                cy: this.y
            }, 500);

            circle.animate({
                "50%" : {
                    scale : "1.2,1.2"
                },
                "100%" : {
                    scale: "1,1"
                }
            }, 500);

        } else if (this.value == 2) {
			
            circle = this.canvas.circle(this.x, this.y, this.radius);
            this.paintComponent(circle);	
			 
            var circle2 = this.canvas.circle(this.x, this.y, this.radius);
			
            circle2.attr("stroke", "#fff");
            circle2.attr("fill", this.deckColor);
            circle2.animate({
                scale: 0
            }, 500, 'bounce',function() {
                circle2.hide();
            });
        }

    }
    this.onmouseover = function() {
        if(!this.mouseover) {
            this.mouseover = true;
            this.drawOver(true);
        }
    }
    this.onmouseout = function() {
        if(this.mouseover) {
            this.mouseover = false;
            this.drawOver(false);
        }
    }
    this.onclick = function(x,y) {
        this.setSelected(!this.selected);
    }
    this.collides = function(x,y) {

        if(x >= this.x - radius && x <= this.x + radius) {
            if(y >= this.y - radius && y <= this.y +radius) {
                return true;
            }
        }
        return false;
    }
}