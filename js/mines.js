var MINES = {};

(function () {
  'use strict';

  // Callbacks with stubs
  MINES.onOpenFieldListener = function(fieldsToOpen, fieldsToOpenNext){};
  MINES.onFlagFieldListener = function(fieldToFlag){};
	MINES.onLose = function(){alert("you lose!");};
	MINES.onWin = function(){alert("gratulations! you win!");};

	// public methods
  MINES.init = function(cols,rows,mines){
  	MINES.mMap = new MMap(cols,rows,mines);
  };
  MINES.reset = function(){
  	MINES.init(MINES.mMmap.cols, MINES.mMmap.rows, MINES.mMmap.mines);
  };
  MINES.clickedAtField = function(x,y){
  	MINES.mMap.clickedAtField(x,y);
  };
  MINES.flagField = function(x,y){
  	MINES.mMap.flagField(x,y);
  };
  MINES.openMinesAroundOpenField = function(x,y){
  	MINES.mMap.openMinesAroundOpenField(x,y);
  };
  // Call when the fieldsToOpenNext array has a length above 0
  MINES.openFields = function(fieldsToOpen){
  	MINES.mMap.openFields(fieldsToOpen);
  };

///// MField Implementation ///////////////////////////////////////////////////////////////////////////////////////////
	var MField = function(x,y){
		var field = this;
		field.x = x;
		field.y = y;
		field.isMine = false;
		field.isOpened = false;
		field.isFlagged = false;
		field.minesAround = 0;
		field.flaggedAround = 0;
		field.neighbors = new Array();

		field.open = function(){
			if(this.isOpened || this.isFlagged) return false;
			this.isOpened = true;
			this.refreshMinesAround();
			
			if(this.isMine){
				MINES.onLose();
			}

			return true;
		};
		field.getChainTriggeredFields = function(){
			if(!this.isOpened) return new Array();

			var chainTriggered = [];
			if(this.minesAround === this.flaggedAround){
				for(var i=this.neighbors.length-1; i>=0; --i){
					var neighbor = this.neighbors[i];
					if(!neighbor.isOpened && !neighbor.isFlagged){
						chainTriggered.push(neighbor);
					} 
				}
			}
			return chainTriggered;
		};
		field.refreshMinesAround = function(){
			var count = 0;
			for(var i=this.neighbors.length-1; i>=0; i--){
				if(this.neighbors[i].isMine) ++count;
			}
			this.minesAround = count;
		};
		field.refreshFlaggedAround = function(){
			var count = 0;
			for(var i=this.neighbors.length-1; i>=0; --i){
				if(this.neighbors[i].isFlagged) ++count;
			}
			this.flaggedAround = count;
		};

		return field;
	};

///// MMap Implementation ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var MMap = function(cols,rows,mines){
		var map = this;
		map.rows = rows;
		map.cols = cols;
		map.mines = mines;
		map.fields = new Array();
		map.started = false;

		// Create all Fields
		for(var y=0; y<rows; y++){
			var row = new Array();
			for(var x=0; x<cols; x++){
				row.push(new MField(x,y));
			}
			map.fields.push(row);
		}

		// concatenate them
		for(var y=0; y<rows; y++){
			for(var x=0; x<cols; x++){
				if(x>0) 													map.fields[y][x].neighbors.push(map.fields[y][x-1]);
				if(y>0) 													map.fields[y][x].neighbors.push(map.fields[y-1][x]);
				if(x<map.cols-1) 									map.fields[y][x].neighbors.push(map.fields[y][x+1]);
				if(y<map.rows-1) 									map.fields[y][x].neighbors.push(map.fields[y+1][x]);
				if(x>0 && y>0) 										map.fields[y][x].neighbors.push(map.fields[y-1][x-1]);
				if(x>0 && y<map.rows-1) 					map.fields[y][x].neighbors.push(map.fields[y+1][x-1]);
				if(x<map.cols-1 && y>0) 					map.fields[y][x].neighbors.push(map.fields[y-1][x+1]);
				if(x<map.cols-1 && y<map.rows-1)	map.fields[y][x].neighbors.push(map.fields[y+1][x+1]);
			} 
		}

		// Methods
		map.clickedAtField = function(x,y){
			var mField = map.fields[y][x];

			if(!map.started){
				map.started = true;
				map.generateMinesAround(x,y);
			}

			if(mField.open()){
				var triggeredFields = mField.getChainTriggeredFields();
				MINES.onOpenFieldListener([mField], triggeredFields);
			}
		};
		map.openFields = function(fieldsToOpen){
			var triggeredFields = [];
			for(var i=fieldsToOpen.length-1; i>=0; --i){
				fieldsToOpen[i].open();
				triggeredFields = triggeredFields.concat(fieldsToOpen[i].getChainTriggeredFields());
			}
			MINES.onOpenFieldListener(fieldsToOpen,triggeredFields);
		};
		map.generateMinesAround = function(x,y){
			var col, row;
			var numberOfMinesToGenerate = map.mines;
			while(numberOfMinesToGenerate > 0){
				row = Math.floor(Math.random()*map.rows);
				col = Math.floor(Math.random()*map.cols);
				if(row >= y-1 && row <= y+1 && col >= x-1 && col <= x+1) continue;
				var field = map.fields[row][col];
				if(!field.isMine){
					field.isMine = true;
					--numberOfMinesToGenerate;
				}
			}
		};
		map.flagField = function(x,y){
			var mField = map.fields[y][x];
			if(mField.isOpened) return;
			mField.isFlagged = !mField.isFlagged;
			MINES.onFlagFieldListener(mField);
		};
		map.openMinesAroundOpenField = function(x,y){
			var mField = map.fields[y][x];
			if(!mField.isOpened) return;

			mField.refreshFlaggedAround();		
			if(mField.flaggedAround === mField.minesAround){
				// Open them all
				var fieldsToOpen = mField.getChainTriggeredFields();
				map.openFields(fieldsToOpen);
			}
		};

		return map;
	};
})();