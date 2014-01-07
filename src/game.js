	Game = {
// This defines our grid's size and the size of each of its tiles
    map_grid: {
        width: 34,			
        height: 24,
        tile: {
            width: 24,
            height: 24,
        }
    },
// The total width of the game screen. Since our grid takes up the entire screen
// this is just the width of a tile times the width of the grid
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },
// The total height of the game screen. Since our grid takes up the entire screen
// this is just the height of a tile times the height of the grid
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
// Initialize and start our game
    start: function() {
// Start crafty and set a background color so that we can see it's working
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(0, 0, 0)');
		
		//nur 32 * 23 Felder wegen Umrandung 
		var	map = [	
		'................................',		
		'................................',
		'....T...........................',
		'WWWWWWWWWHWWWWWWW...............',
		'.........H-------------.........',
		'.........H....WWH...............',
		'.........H....WWH......T........',
		'.........H....WWH....WWWWHWWWWWW',
		'.........H....WWH........H......',
		'.........H....WWH........H......',
		'.........H....WWH.......TH......',
		'WWWWHWWWWW....WWWWWWHWWWWWWWWWWW',
		'....H...............H...........',
		'....H...............H...........',
		'....H...............H...........',
		'WWWWWWWWWWWWHWWWWWWWHWWWWWWWWWWW',
		'............H.......H...........',
		'............H.......H...........',		
		'.........T..H-------H...T.......',
		'......HWWWWWWW......WWWWWWWWWWWH',
		'......H........................H',
		'......H........P...T...........H',
		'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'							
		];
		
		
//First, count the treasures

		var numberOfTreasures = 0;
		for (var y = 0; y < Game.map_grid.height; y++) {
				for (var x = 0; x < Game.map_grid.width; x++) { 		
					if (map[y][x] == 'T'){				
						numberOfTreasures++;					
					}
				}		
			}
		
//then we create an array to save them in

		var treasures = new Array(numberOfTreasures);
		for (var i = 0; i < numberOfTreasures; i++) {
			treasures[i] = new Array(2);
		}

//initialize the array- hereby the first cell determines the state of the treasure with a number
//0 declares its on the field
//1 declares it is owned by a player
//2 declares it is owned by an enemy
//The second cell is as of yet empty and will be used to determine the ID of the enemy owning the treasure		
		
		for (var i = 0; i < numberOfTreasures; i++) {
			for(var j = 0; j < 2; j++) {
				treasures[i][j] = 0;
			}
		}
	
//Access cells with
//array[x][y];
	
//an event listener to keep track of the treasures
 
 /*todo*/
		this.show_victory = this.bind('TreasureCollected', function() {

			
		
		});

	
//an event listener to spawn the ladder
 /*todo*/

			

// Place a tree at every edge square on our grid of 16x16 tiles
        for (var y = 0; y < Game.map_grid.height; y++) {
		
			for (var x = 0; x < Game.map_grid.width; x++) {    
					
					if (x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1) {																					
					Crafty.e('Frame').at(x, y);						
					}
			
				while(map[y][x] == 'W' || map[y][x] == 'X' || map[y][x] == 'H' || map[y][x] == '-'){
									
 				
					while (map[y][x] == 'W'){
					Crafty.e('Stone').at(x+1, y+1);					
					x++;
					}
					
					while (map[y][x] == 'H'){
					Crafty.e('Ladder').at(x+1, y+1);
					x++;
					}
					while (map[y][x] == '-'){
					Crafty.e('Pole').at(x+1, y+1);
					x++;
					}					
				}			                
                if (map[y][x] == 'T'){
				Crafty.e('Treasure').at(x+1, y+1);				
				}
				if (map[y][x] == 'P'){
				Crafty.e('PlayerCharacter').at(x+1, y+1);				
				}	
            } 
        }					
    }		
}