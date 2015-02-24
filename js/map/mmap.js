define function(['mcell'], MCell){

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };

  var MMap = {
    rows: 0,
    cols: 0,
    mines: 0,
    cells: [],
    started: false,
    flagsLeft: 0,
    startTime: 0,
    lost: false
  }

  MMap.prototype.constructor = function(cols,rows,mines){
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.flagsLeft = mines;

    // Create all Fields
    for(var y=0; y<rows; y++){
      var row = new Array();
      for(var x=0; x<cols; x++){
        row.push(new MCell(x,y));
      }
      this.cells.push(row);
    }

    // concatenate them
    for(var y=0; y<rows; y++){
      for(var x=0; x<cols; x++){
        if(x>0)                             this.cells[y][x].neighbors.push(this.cells[y  ][x-1]);
        if(y>0)                             this.cells[y][x].neighbors.push(this.cells[y-1][x  ]);
        if(x<this.cols-1)                   this.cells[y][x].neighbors.push(this.cells[y  ][x+1]);
        if(y<this.rows-1)                   this.cells[y][x].neighbors.push(this.cells[y+1][x  ]);
        if(x>0 && y>0)                      this.cells[y][x].neighbors.push(this.cells[y-1][x-1]);
        if(x>0 && y<this.rows-1)            this.cells[y][x].neighbors.push(this.cells[y+1][x-1]);
        if(x<this.cols-1 && y>0)            this.cells[y][x].neighbors.push(this.cells[y-1][x+1]);
        if(x<this.cols-1 && y<this.rows-1)  this.cells[y][x].neighbors.push(this.cells[y+1][x+1]);
      } 
    }
  }

  // Methods
  MMap.prototype.clickedAtField = function(x,y){
    if(!this.started){
      this.started = true;
      this.startTime = (new Date).getTime();
      this.generateMinesAround(x,y);
    }

    var cell = this.cells[y][x];
    if(cell.open()){
      var triggeredFields = cell.getChainTriggeredFields();
      MINES.onOpenFieldListener([cell], triggeredFields);
    }
  };

  MMap.prototype.openFields = function(cellsToOpen){
    var triggeredFields = [];
    for(var i=cellsToOpen.length-1; i>=0; --i){
      cellsToOpen[i].open();
      triggeredFields = triggeredFields.concat(cellsToOpen[i].getChainTriggeredFields());
    }
    var uniqueFields = [];
    $.each(triggeredFields, function(i, el){
        if($.inArray(el, uniqueFields) === -1) uniqueFields.push(el);
    });
    
    MINES.onOpenFieldListener(cellsToOpen,uniqueFields);
  };

  MMap.prototype.generateMinesAround = function(x,y){
    var col, row;
    var numberOfMinesToGenerate = map.mines;
    while(numberOfMinesToGenerate > 0){
      row = Math.floor(Math.random()*map.rows);
      col = Math.floor(Math.random()*map.cols);
      if(row >= y-1 && row <= y+1 && col >= x-1 && col <= x+1) continue;
      var field = map.cells[row][col];
      if(!field.isMine){
        field.isMine = true;
        --numberOfMinesToGenerate;
      }
    }
  };

  MMap.prototype.flagField = function(x,y){
    if(!map.started) return;
    var mField = map.cells[y][x];
    if(mField.isOpened) return;
    mField.isFlagged = !mField.isFlagged;
    MINES.onFlagFieldListener(mField);
    if(mField.isFlagged) --map.flagsLeft;
    else ++map.flagsLeft;
    MINES.onFlagAmountChanged(map.flagsLeft);

    if(MINES.assistLevel >= 1){
      var triggeredFields = new Array();
      for(var i=mField.neighbors.length-1; i>=0; --i){
        var f = mField.neighbors[i];
        if(f.isOpened){
          f.refreshFlaggedAround();
          if(mField.flaggedAround === mField.minesAround){
            triggeredFields = triggeredFields.concat(f.getChainTriggeredFields());
          }
        }
      }
      if(triggeredFields.length>0) map.openFields(triggeredFields);
    }
  };

  MMap.prototype.openMinesAroundOpenField = function(x,y){
    var mField = map.cells[y][x];
    if(!mField.isOpened) return;

    mField.refreshFlaggedAround();    
    if(mField.flaggedAround === mField.minesAround){
      // Open them all
      var cellsToOpen = mField.getChainTriggeredFields();
      map.openFields(cellsToOpen);
    }
  };

  MMap.prototype.secondsPassed = function(){
  	if(map.startTime === 0) return 0;

  	var milliPassed = (new Date).getTime() - map.startTime;
  	return Math.floor(milliPassed / 1000);
  }

  return MMap;
}