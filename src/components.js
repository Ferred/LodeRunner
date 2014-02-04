var level1 =[
    '.........................T......',
    '.........................h......',
    'WWWWWWWWWHWWWWWWW........h......',
    '.........H---------------h......',
    '.........H....WWH........h......',
    '.........H....WWH......T.h......',
    '.........H....WWH....WWWWHWWWWWW',
    '.........H....WWH........H......',
    '.........H....WWH........H......',
    '.........H....WWH.......tH......',
    'WWWWHWWWWW....WWWWWWHWWWWWWWWWWW',
    '....H...............H...........',
    '....H...............H...........',
    '....H........E......H...........',
    'WWWWWWWWWWWWHWWWWWWWHWWWWWWWWWWW',
    '............H.......H...........',
    '............H.......H...........',	
    '.........t..H-------H...t.......',
    '......HWWWWWWW......WWWWWWWWWWWH',
    '......H........................H',
    '......H.........p..t...........H',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '', // nicht entfernen!
    '' // nicht entfernen!
    ];

// // The Grid component allows an element to be located
// on a grid of tiles
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },
// Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return {x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height}
        } else {
            this.attr({x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height});
            return this;
        }
    }
});

// // An "Actor" is an entity that is drawn in 2D on canvas
// via our logical coordinate grid
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    },
});
Crafty.c('Frame', {
    init: function() {
        this.requires('Actor, Color, Solid')
                .color('rgb(254, 254, 254)');
    },
});

 
Crafty.c('Stone', { //ohne spritemapping
    init: function() {
        this.requires('Actor, Solid, Image')
                .image('assets/Stein_oK_72ppi.png');
    },
});
/*Crafty.c('Concrete', { not in use yet
init: function() {
this.requires('Actor, Solid, Image')
.image('assets/concrete.png');
},
}); */
Crafty.c('Ladder', {
    init: function() {
        this.requires('Actor, Image')
               // .image('assets/Leiter_oK_24x24_72ppi.png');
.image('assets/Ladder.png');
               
    },
});
Crafty.c('Pole', {
    init: function() {
        this.requires('Actor, Image')
                .image('assets/Pole.png');
    },
});
 
 
 //Gegner
 var deadEnd = 0; //Is for the ai. Checks if enemy is in an Deadend loop
 var checkX = 0; //For checking if Enemy is running continousely against an block
 var xTimeOut = 0;
 var xTimtOutReset = 0;
 var climbingDirection = 0; //2 is up 4 is down;
 var lastDir = 0;
 var walkingDirection = 0;//1 is left 3 is right;
 
 Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, Gravity, spr_enemy, SpriteAnimation')
                //.stopOnSolids()
                .bind('EnterFrame', this.movePlayer)
                .animate("walk_left", 0, 0, 2)
                .animate("walk_right", 3, 0, 5)
                .animate("walk_up", 3, 0, 5)
                .animate("walk_down", 0, 0, 2)
                .onHit('Treasure', this.collectTreasure);
    },
movePlayer: function ()
        {
            //this.ai();
        },
/* var animation_speed = 8;
this.bind('NewDirection', function(data) {
if (data.x > 0) {
this.animate('walk_right', animation_speed, -1);
} else if (data.x < 0) {
this.animate('walk_left', animation_speed, -1);
} else if (data.y > 0) {
this.animate('walk_down', animation_speed, -1);
} else if (data.y < 0) {
this.animate('walk_up', animation_speed, -1);
} else {
this.stop();
}
}); */
    
    //needs direction.0 = Stop, 1 = Left, 2 = UP 3= Right, 4 = Down
    //Var speed regulates the movement speed. Just for changing position. ai is for the Movingorders.
    move: function(direction) {
        var speed = 1;
        
        if (direction == 0)//stop
        {
            this.x += 0;
            this.y += 0;
            //this.gravity('Solid');
        }
        else if (direction == 1)//left
        {
            this.x -= speed;
            //this.gravity('Solid');
        }
        else if (direction == 3)//up
        {
            this.x += speed;
            //this.antigravity();
        }
        else if (direction == 2)//right
        {
            this.y -= speed;
            //this.gravity('Solid');
        }
        else if (direction == 4)//down
        {
            this.y += speed;
            //this.antigravity();
        }
            
        
        
    },
    
    
    // the ai looks where the player is and tries toget the same coordinate as the player.
    // If the Enemy is in a DeadEnd at the border of the Field it walks a way in the other direction.
    // If it stucks again it walks a little back.
    // If the Enemy stucks somewhere in the middle (for 1 Second) and DeadAnd is not active, it walks until a ladder
    // or the border comes (the Dead End is active again).
    // When the enemy could take a ladder and the player is not the same height, it takes the ladder
    ai: function() {
        
        //checks if Enemy is in an deadEnd. DeadEnd = 0 means everything is okay,
        //DeadEnd = 1, is at the leftside of the screen --> needs to walk right
        //DeadEnd = 2, is at the rightside of the screen --> needs to walk left
        //DeadEnd = 3, is stopped somwhere by a block
        
        if(this.detectNextBlock_Down() == '.')
        {
            move(4);
        }
        else
        {
            if(this.x == 0)
            {
                deadEnd = 1;
            }

            if (this.x == ((32 * 24) - 23))
            {
                deadEnd = 2;
            }


            //check if Enemy stucks somewhere in the middle
            if (this.x = checkX)
            {
                timeOut =+ 1;
            }
            //moves the Enemy
            if (deadEnd == 0)
            {
                if (timout<= 1000)//stucks nowhere
                {
                    walkingDirection = 0;//reset for the case a time out happens
                    // gegner ist weiter oben als spieler --> nach oben laufen
                    if (this.detectNextBlock_Up == 'H' (climbingDirection == 0 || climbingDirection == 2) && (Crafty.c('Player Character').y >= this.y) )
                    {
                        move(2);
                         if((detectNextBlock_Up == '.' || detectNextBlock_Up == 'W' ) && (detectNextBlock_Left == '.' || detectNextBlock_Right == 'W' ))
                        {
                            climbingDirection = 5;
                        }
                        else
                        {
                            climbingDirection = 2;
                        }
                    }
                    // gegner ist weiter unten als spieler --> nach unten laufen
                    else if (dectextNextBlock_Down == 'H' (climbingDirection == 0 || climbingDirection == 4) && (Crafty.c('Player Character').y <= this.y))
                    {
                        move(4);
                        if(detectNextBlock_Down == 'W')
                        {
                            climbingDirection = 0;
                        }
                        else
                        {
                            climbingDirection = 4;
                        }
                    }
                    // gegner ist weiter rechts als spieler --> links laufen
                    else if (detectNextBlock_Left() == '.' && (ClimbingDirection == 0 || ClimbingDirection == 5) && (Crafty.c('Player Character').x <= this.x))
                    {
                        move(1);
                        climbingDirection = 0;
                        lastDir = 1;
                    }
                    // gegner ist weiter links als spieler --> rechts laufen
                    else if (detectNextBlock_Right() == '.' && (ClimbingDirection == 0 || ClimbingDirection == 5) && (Crafty.c('Player Character').x >= this.x))
                    {
                        move(3);
                        climbingDirection = 0;
                        lastDir = 3;
                    }
                    else //Falls Spieler nicht auf gleichen Y aber auf gleichen x
                    {
                        move(lastDir);
                    }




                    /*if (Crafty.c('Player Character').x <= this.x)// gegner ist weiter rechts als spieler --> links laufen
{
move(1);
}
else if (Crafty.c('Player Character').x >= this.x)// gegner ist weiter links als spieler --> rechts laufen
{
move(3);
}
else if (Crafty.c('Player Character').y >= this.y)// gegner ist weiter oben als spieler --> nach oben laufen
{
move(2);
}
else if (Crafty.c('Player Character').y <= this.y)// gegner ist weiter unten als spieler --> nach unten laufen
{
move(4);
}*/
                }
                else if (xTimOut >= 1000)
                {
                    if (detectNextBlock_Up() == 'H' (climbingDirection == 0 || climbingDirection == 2))
                    {
                        move(2);
                         if((detectNextBlock_Up() == '.' || detectNextBlock_Up() == 'W' ) && (detectNextBlock_Left() == '.' || detectNextBlock_Right() == 'W' ))
                        {
                            climbingDirection = 5;
                        }
                        else
                        {
                            climbingDirection = 2;
                        }
                    }
                    else if (detectNextBlock_Down() == 'H' (climbingDirection == 0 || climbingDirection == 4))
                    {
                        move(4);
                        if(detectNextBlock_Down() == 'W')
                        {
                            climbingDirection = 0;
                        }
                        else
                        {
                            climbingDirection = 4;
                        }
                    }
                    else if (detectNextBlock_Left() == '.' && (ClimbingDirection() == 0 || ClimbingDirection() == 5) && (walkingDirection == 0 || walkingDirection == 1))
                    {
                        move(1);
                        walkingDirection = 1;
                    }
                    else if (detectNextBlock_Right() == '.' && (ClimbingDirection() == 0 || ClimbingDirection() == 5) (walkingDirection == 0 || walkingDirection == 3))
                    {
                        move(3);
                        walkingDirection = 3;
                    }
                    xTimeOutReset += 1; // beendet loop
                    if (xTimeOutReset >= 3000)
                    {
                        xTimeOutReset = 0;
                        xTimeOut = 0;
                    }
                }
            }
            else if (deadEnd == 1)
            {
                move(3);

                if((this.x/4) >= 8)
                {
                    deadEnd = 0;
                }
                else if (timeOut >= 100)
                {
                    deadEnd = 2;
                    timeOut = 0;
                }
            }
            else if (deadEnd == 2)
            {
                move(1);
                 if((this.x/4) <= 8)
                {
                    deadEnd = 0;
                }
                else if (timeOut >= 100)
                {
                    deadEnd = 1;
                    timeOut = 0;
                }
            }
        }
                
                
    },
    
    //Returns the Block ID (Stone, Ladder, etc.).
    //Needs map coordinates not pixels
    blockIs: function (mapCoordY, mapCoordX)
    {
            //return Game.map[mapCoordY].charAt(mapCoordX);
            
    },

    //Detects the upcoming block in -x direction
    detectNextBlock_Left: function ()
    {
        var mapCoordY = (this.y )/ this.h;
        var mapCoordX = (this.x - 1) / this.w;

        return(this.blockIs(mapCoordY, mapCoordX));
    },
    //Detects the upcoming block -y direction
    detectNextBlock_Up: function ()
    {
        var mapCoordY = (this.y - 1)/ this.h;
        var mapCoordX = (this.x ) / this.w;

        return(this.blockIs(mapCoordY, mapCoordX));
    },
    //Detects the upcoming block +x direction
    detectNextBlock_Right: function ()
    {
        var mapCoordY = (this.y)/ this.h;
        var mapCoordX = (this.x + this.w) / this.w;

        return(this.blockIs(mapCoordY, mapCoordX));
    },
    //Detects the upcoming block und +y direction
    detectNextBlock_Down: function ()
    {
        var mapCoordY = (this.y + this.h)/ this.h;
        var mapCoordX = (this.x) / this.w;

        return(this.blockIs(mapCoordY, mapCoordX));
    },

    // Registers a stop-movement function to be called when
// this entity hits an entity with the "Solid" component
    stopOnSolids: function() {
        this.onHit('Solid', this.stopMovement);

        return this;	
    },
stopMovement: function () {
        if (this._movement) {
            this.x -= this._movement.x;
            if (this.hit('Solid') != false) {
                this.x += this._movement.x;
                this.y -= this._movement.y;
                if (this.hit('Solid') != false) {
                    this.x -= this._movement.x;
                  // this.y -= this._movement.y;
                }
            }
        } else {
            this._speed = 0;
            }
        },
// Respond to this player collecting a Treasure
collectTreasure: function(data) {
treasure = data[0].obj;
treasure.collect();
}
 });
 
//The Deegre directionn vor Multiway
var upDeg = -90;
var downDeg = 90;
var rightDeg = 0;
var leftDeg = 180;

//setInterval(Crafty.e('PlayerCharacter').h += 10, 1000);
// This is the player-controlled character

Crafty.c('PlayerCharacter', {
    
   
    
    init: function() {
        this.requires('Actor, Multiway, Collision, Gravity, spr_player, SpriteAnimation, Keyboard')// Multiway: Character goes in the direction of the degree number. Right Arrow = 0 (Clockwise). Number in the Beginnig is the speed.
                //.multiway(4,{UP_ARROW: upDeg, DOWN_ARROW: downDeg, RIGHT_ARROW: rightDeg, LEFT_ARROW: leftDeg})
                //.multiway(4,{RIGHT_ARROW: rightDeg, LEFT_ARROW: leftDeg})
                .bind('KeyDown', this.keyTester)
                .bind('KeyUp', this.keyTester)
                .bind('EnterFrame', this.movePlayer)
//.gravity('Solid') //use gravityTester instead
                //.stopOnSolids()
                //.caseTester()
                //.climbTester()
.animate("walk_left", 0, 0, 2)
                .animate("walk_right", 3, 0, 5)
                .animate("walk_up", 3, 0, 5)
                .animate("walk_down", 0, 0, 2)
                //.onHit('Ladder', this.antigravity) // ist nur vorrübergehend, damit man das level beenden kann
                .onHit('Treasure', this.collectTreasure)
				.onHit('Exit', this.hitExit);

var animation_speed = 8;
        this.bind('NewDirection', function(data) {
        if (data.x > 0) {
this.animate('walk_right', animation_speed, -1);
        } else if (data.x < 0) {
this.animate('walk_left', animation_speed, -1);
        } else if (data.y > 0) {
this.animate('walk_down', animation_speed, -1);
        } else if (data.y < 0) {
this.animate('walk_up', animation_speed, -1);
        } else {
this.stop();
        }
        });
                
    },
//Returns the Block ID (Stone, Ladder, etc.).
        //Needs map coordinates not pixels
blockIs: function (mapCoordY, mapCoordX)
{
                //var block = Game.map[mapCoordY][maprCoordX];
                //return Game.map[mapCoordY][mapCoordX];
                return level1[mapCoordY][mapCoordX];
                //return block;
                //console.log(Game.map[mapCoordY][mapCoordX]);
},
    
        //Detects the upcoming block in -x direction
        detectNextBlock_Left: function ()
        {
            var mapCoordY = (this.y )/ this.h;
            var mapCoordX = (this.x - 1) / this.w;
            
            return(this.blockIs(mapCoordY, mapCoordX));
        },
        //Detects the upcoming block -y direction
        detectNextBlock_Up: function ()
        {
            var mapCoordY = (this.y - 1)/ this.h;
            var mapCoordX = (this.x ) / this.w;
            
            return(this.blockIs(mapCoordY, mapCoordX));
        },
        //Detects the upcoming block +x direction
        detectNextBlock_Right: function ()
        {
            var mapCoordY = (this.y)/ this.h;
            var mapCoordX = (this.x + this.w) / this.w;
            
            return(this.blockIs(mapCoordY, mapCoordX));
        },
        //Detects the upcoming block und +y direction
        detectNextBlock_Down: function ()
        {
            var mapCoordY = (this.y + this.h)/ this.h;
            var mapCoordX = (this.x) / this.w;
            
            mapCoordX = Math.floor(mapCoordX);
            mapCoordY = Math.floor(mapCoordY);
            
            /*console.log('x und y');
console.log(mapCoordY);
console.log(mapCoordX);*/
           
            
            //console.log(this.blockIs(mapCoordY, mapCoordX));
           // console.log('this.blockIs()');
           // console.log((this.blockIs(mapCoordY, mapCoordX)));
            var blockReturn = this.blockIs(mapCoordY, mapCoordX);
            
            //return(this.blockIs(mapCoordY, mapCoordX))
            //console.log('blockReturn');
            //console.log(blockReturn);
            return (this.blockReturn);
            //console.log('==============================');
        },
        //animationSpeed: 5,
        keyTester: function ()
        {
          this.moveDirection = 0;
          //console.log(this.isDown('LEFT_ARROW'))
          if(this.isDown('LEFT_ARROW'))
          {
              this.moveDirection = 1;
              this.animate('walk_left', 10, -1);
          }
          else if(this.isDown('RIGHT_ARROW'))
          {
              this.moveDirection = 3;
              this.animate('walk_right', 10, -1);
          }
           else if(this.isDown('UP_ARROW'))
          {
              this.moveDirection = 2;
              this.animate('walk_up', 10, -1);
          }
           else if(this.isDown('DOWN_ARROW'))
          {
              this.moveDirection = 4;
              this.animate('walk_down', 10, -1);
          }
          else if(this.isDown('M'))
          {
              this.moveDirection = 3;
              this.animate('walk_left', 15, -1);
          }
          else
          {
              this.stop();
          }
          
        },
        moveDirection : 0,
        playerSpeed : 2,
        movePlayer: function ()
        {
            console.log('detectNextBlock_Down');
            console.log(this.detectNextBlock_Down());
            if (this.detectNextBlock_Down() == '.')
            {
                this.y += this.speed;
            }
            else if(this.moveDirection == 1)//left
            {
                this.x -= this.playerSpeed;
            }
            else if(this.moveDirection == 2)//up
            {
                this.y -= this.playerSpeed;
            }
             else if(this.moveDirection == 3)//right
            {
                this.x += this.playerSpeed;
            }
             else if(this.moveDirection == 4)//down
            {
                this.y += this.playerSpeed;
            }
        },
        
// Respond to this player collecting a Treasure
	collectTreasure: function(data) {
		treasure = data[0].obj;
		treasure.collect();
	},
    //Respond to the player hitting the Exit
	hitExit: function(data) {
		exit = data[0].obj;
        exit.collect();
    }
        
});

//returns number for arrow_keys
function key_down(e)
{
    var key_id = e.keyCode || e.which;
    
    if (key_id == 40)//down key
        return 0;
    if (key_id == 37)//left key
        return 1;
    if (key_id == 38)//up key
        return 2;
    if (key_id == 39)//right key
        return 3;
}

Crafty.c('Treasure', {

    init: function() {
        this.requires('Actor, Image')
                .image('assets/Schatz_24x19_72ppi.png');
    },
        
        collect: function() {
        this.destroy();
        Crafty.trigger('TreasureCollected', this);
	}
});

//the exit which allows the player to leave the level
Crafty.c('Exit', {

    init: function() {
        this.requires('Actor, Image')
                 .image("assets/exit.png");
    },
        
        collect: function() {
        this.destroy();
        Crafty.trigger('levelCompleted', this);
	}

});


//treasure container class. Saves number of treasures as the size of the array and the state of them as data in it.
Crafty.c('TreasureContainer', {

    init: function() {
		this._treasures  = new Array();
	},
	
    add: function() {
		this._treasures.push("Uncollected");
    },
       
	getLength: function() {
		return this._treasures.length;
	},

	// a function to check if all treasures have been collected;
	//returns true if they are, otherwise returns false
	checkTreasures: function() {
	
		var result = true;
	
		for(var i = 0; i < this._treasures.length; i++) {
			if( this._treasures[i] != "Collected") {
				result = false;
			}
		}
		return result;
	},
	
	//a function to safe that a treasure has been collected by the player
	collectTreasure: function() {
		for(var i = 0; i < this._treasures.length; i++) {
			if( this._treasures[i] == "Uncollected") {
				this._treasures[i] = "Collected";
				break;
			}		
		}
	},
});
