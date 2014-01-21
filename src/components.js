// The Grid component allows an element to be located
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
                .color('rgb(220, 220, 220)');
    },
});

Crafty.c('Stone', {
    init: function() {
        this.requires('Actor, Color, Solid')
                .color('rgb(139,26,26)');
    },
});

Crafty.c('Ladder', {
    init: function() {
        this.requires('Actor, Color')
                .color('rgb(205,193,197)');
    },
});

Crafty.c('Pole', {
    init: function() {
        this.requires('Actor, Color')
                .color('rgb(230,230,230)');
    },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function() {
        this.requires('Actor, Multiway, Color, Collision, Gravity')// Multiway: Character goes in the direction of the degree number. Right Arrow = 0 (Clockwise). Number in the Beginnig is the speed.
                .multiway(4,{UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
		.gravity('Solid')
                .color('rgb(150, 150, 150)')
                .stopOnSolids()
		.onHit('Treasure', this.collectTreasure);
    },
        //Wird nicht benötigt ist sinnlos
	//"Reads" the map. Each Block around the player is saved in an array.
	//Index 0 is the block in the upper left corner and then its clockwise around till 8. 
	//It returns an array with the "code-letters" of the Block.
	/*surroundingBlock: function () {
		var block = [];
                var x_pos = this.y;
                var y_pos = this.x;
		x_pos = Math.round(x_pos);
		y_pos = Math.round(y_pos);
                
		block [0] = standingOn(x_pos -1, y_pos -1);
		block [1] = standingOn(x_pos , y_pos -1);//ceeiling
		block [2] = standingOn(x_pos +1 , y_pos -1);
		block [3] = standingOn(x_pos +1, y_pos);//right
		block [4] = standingOn(x_pos +1, y_pos +1);
		block [5] = standingOn(x_pos , y_pos +1);//bottom
		block [6] = standingOn(x_pos -1, y_pos +1);
		block [7] = standingOn(x_pos -1, y_pos );//left
		
		return this.block;
	},*/
	//Returns the Block ID (Stone, Ladder, etc.).
        //Needs map coordinates not pixels
	blockIs: function (mapCoordY, mapCoordX)
	{          
                return Game.map[mapCoordY].charAt(mapCoordX);
	},
        //says you, if there is a special type of Block, at specific position aroud the player.
        //returns true and false
        // blockType: Enter the letter of the Block (for exmaple 'H' for Ledder)
        // postion: position 0 is the block in the upper left corner and then its clockwise around till 8. 
        /*checkBlock : function (blockType, position)
        {
            var blockArray = Crafty.e('PlayerCharacter').surroundingBlock();
            if(blockType == blockArray[position]);
        },*/
    
        //Detects the upcoming block und -x and -y direction
        detectNextBlock_LeftAndUp: function ()
        {
            var mapCoordY = (this.y - 1)/ this.h;
            var mapCoordX = (this.x - 1) / this.w;
            
            return(blockIs(mapCoordY, mapCoordX));
        },
        //Detects the upcoming block und +x and +y direction
        detectNextBlock_RightAndDown: function ()
        {
            var mapCoordY = (this.y + this.h)/ this.h;
            var mapCoordX = (this.x + this.w) / this.w;
            
            return(blockIs(mapCoordY, mapCoordX));
        },
        //Ables/disables climbing ability. Leads Player to the next leader, when the Ladder is within one Block
        climbMaster: function ()
        {
            if(key_down() ==  2){
                
            }
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
                  //  this.y -= this._movement.y;
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
/*
<<<<<<< HEAD
=======
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

>>>>>>> 2461cac70ad87a2b3b5fa8776d811d100e37d531

*/
Crafty.c('Treasure', {
	 
	 _id : 0,
	 
    init: function() {
        this.requires('Actor, Color')
                .color('rgb(245,184,0)');
    },
	
	collect: function() {
		this.destroy();
		Crafty.trigger('TreasureCollected', this);	 
	},

	treasure: function(id) { this.id = id}

});

Crafty.c('Exit', {
    init: function() {
        this.requires('Actor, Color')
                .color('rgb(205,105,197)');
    },
	
	finish: function() {
		Crafty.trigger('LevelComplete');	 
	},
});