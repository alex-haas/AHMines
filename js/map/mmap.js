define(['map/mcell','globals'], function(MCell, Globals){
  'use strict';
  
  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };

  var MMap = function(cols,rows,mines){
    if(rows<=0 || cols<=0) throw "rows or cols zero or negative";
    if(cols*rows-9 < mines) throw "too many mines";

    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.flagsLeft = mines;

    // Create all Cells
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

  MMap.prototype = {
    /* callbacks */
    callbacks: {
      openFields: function(cellsToOpen, TriggeredCells){},
      fieldFlagged: function(field){},
      flagAmountChanged: function(newAmount){}
    },

    /* attributes */
    rows: 0,
    cols: 0,
    mines: 0,
    cells: [],
    started: false,
    flagsLeft: 0,
    lost: false
  }

  MMap.prototype.constructor = MMap;

  // Methods
  MMap.prototype.clickedAtField = function(x,y){
    console.log('MMap: clicked at x:'+x+' y:'+y);

    if(!this.started){
      this.started = true;
      this.startTime = (new Date).getTime();
      this.generateMinesAround(x,y);
      // TODO: this.callbacks.gameStarted
    }

    var cell = this.cells[y][x];
    if(cell.open()){
      console.log('field is open -> get triggered fields and delegate to gui');
      console.log(this.callbacks);
      var triggeredFields = cell.getChainTriggeredFields();
      this.callbacks.openFields([cell], triggeredFields);
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
    
    this.callbacks.openFields(cellsToOpen,uniqueFields);
  };

  MMap.prototype.generateMinesAround = function(x,y){
    var col, row;
    var numberOfMinesToGenerate = this.mines;
    while(numberOfMinesToGenerate > 0){
      row = Math.floor(Math.random()*this.rows);
      col = Math.floor(Math.random()*this.cols);
      if(row >= y-1 && row <= y+1 && col >= x-1 && col <= x+1) continue;
      var field = this.cells[row][col];
      if(!field.isMine){
        field.isMine = true;
        --numberOfMinesToGenerate;
      }
    }
  };

  MMap.prototype.flagField = function(x,y){
    if(!this.started) return;
    var mField = this.cells[y][x];
    if(mField.isOpened) return;
    mField.isFlagged = !mField.isFlagged;
    this.callbacks.fieldFlagged(mField);
    if(mField.isFlagged) --this.flagsLeft;
    else ++this.flagsLeft;
    this.callbacks.flagAmountChanged(this.flagsLeft);

    if(Globals.currentClient.assistLevel >= 1){
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
      if(triggeredFields.length>0) this.openFields(triggeredFields);
    }
  };

  MMap.prototype.openMinesAroundOpenField = function(x,y){
    var mField = this.cells[y][x];
    if(!mField.isOpened) return;

    mField.refreshFlaggedAround();    
    if(mField.flaggedAround === mField.minesAround){
      // Open them all
      var cellsToOpen = mField.getChainTriggeredFields();
      this.openFields(cellsToOpen);
    }
  };

  MMap.prototype.secondsPassed = function(){
  	if(this.startTime === 0) return 0;

  	var milliPassed = (new Date).getTime() - this.startTime;
  	return Math.floor(milliPassed / 1000);
  }

  return MMap;
});