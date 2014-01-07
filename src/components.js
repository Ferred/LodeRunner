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

// A Tree is just an Actor with a certain color
Crafty.c('Frame', {
    init: function() {
        this.requires('Actor, Color, Solid')
                .color('rgb(220, 220, 220)');
    },
});

// A Bush is just an Actor with a certain color
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
        this.requires('Actor, Fourway, Color, Collision') //insted of Fourway use .twoway(2) or .gravity(?). must work somehow
                .fourway(4)
                .color('rgb(150, 150, 150)')
                .stopOnSolids()
				.onHit('Treasure', this.collectTreasure);
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

//Todo add ID to treasure
Crafty.c('Treasure', {
	_var id,
	
    init: function() {
        this.requires('Actor, Color')
                .color('rgb(245,184,0)');
    },
	
	collect: function() {
	this.destroy();
	/*
<<<<<<< HEAD
	 Crafty.trigger('TreasureCollected', this);
	},
	
	treasure: function(var id) { this.id = id}
=======
*/
	Crafty.trigger('TreasureCollected', this);
}
>>>>>>> 2e869a31796f6df2446d1c2597d58f7bf02b188d
});