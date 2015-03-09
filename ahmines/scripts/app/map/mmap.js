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

    var y,x,row,cell;

    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.flagsLeft = mines;
    this.openCountForWin = cols * rows - mines;

    // Create all Cells
    for(y=0; y<rows; y++){
      row = [];
      for(x=0; x<cols; x++){
        cell = new MCell(x,y);
        cell.delegate = this;
        row.push(cell);
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
    /* delegate */
    delegate: {
      MMapOpenFields: function(cellsToOpen, TriggeredCells){},
      MMapFieldFlagged: function(field){},
      MMapFlagAmountChanged: function(newAmount){},
      MMapPlayerWon: function(){},
      MMapPlayerLost: function(){}
    },

    /* attributes */
    rows: 0,
    cols: 0,
    mines: 0,
    cells: [],
    started: false,
    flagsLeft: 0,
    lost: false,
    opened: 0,
    openCountForWin: 0
  }

  MMap.prototype.constructor = MMap;

  var MClientInterfaceMethods = (function(){
    /** Helper **/
    function generateMinesAround(field, mmap) {
      var x=field.x, y=field.y, col, row, f;
      var numberOfMinesToGenerate = mmap.mines;
      while(numberOfMinesToGenerate > 0){
        row = Math.floor(Math.random()*mmap.rows);
        col = Math.floor(Math.random()*mmap.cols);
        if(row >= y-1 && row <= y+1 && col >= x-1 && col <= x+1) continue;
        f = mmap.cells[row][col];
        if(!f.isMine){
          f.isMine = true;
          --numberOfMinesToGenerate;
        }
      }
    }

    /** PUBLIC **/
    function openField(field) {
      if(!this.started){
        this.started = true;
        this.startTime = (new Date).getTime();
        generateMinesAround(field,this);
        // TODO: this.delegate.gameStarted
      }

      if(field.open()){
        var triggeredFields = field.getChainTriggeredFields();
        this.delegate.MMapOpenFields([field], triggeredFields);
      }
    }
    function openFields(cellsToOpen) {
      var triggeredFields = [];
      for(var i=cellsToOpen.length-1; i>=0; --i){
        if(cellsToOpen[i].open()){
          this.openFields
          triggeredFields = triggeredFields.concat(cellsToOpen[i].getChainTriggeredFields());
        }
      }
      var uniqueFields = [];
      $.each(triggeredFields, function(i, el){
          if($.inArray(el, uniqueFields) === -1) uniqueFields.push(el);
      });
      
      this.delegate.MMapOpenFields(cellsToOpen,uniqueFields);
    }
    function flagField(x,y) {
      if(!this.started) return;
      var mField = this.cells[y][x];
      if(mField.isOpened) return;
      mField.isFlagged = !mField.isFlagged;
      this.delegate.MMapFieldFlagged(mField);
      if(mField.isFlagged) --this.flagsLeft;
      else ++this.flagsLeft;
      this.delegate.MMapFlagAmountChanged(this.flagsLeft);

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
    }
    function openMinesAroundOpenField(x,y) { /** TODO: change to 'field' for a consistent API **/
      var mField = this.cells[y][x];
      if(!mField.isOpened) return;

      mField.refreshFlaggedAround();    
      if(mField.flaggedAround === mField.minesAround){
        // Open them all
        var cellsToOpen = mField.getChainTriggeredFields();
        this.openFields(cellsToOpen);
      }
    }

    return function(){
      this.openField = openField;
      this.openFields = openFields;
      this.flagField = flagField;
      this.openMinesAroundOpenField = openMinesAroundOpenField;
      return this;
    }
  })();

  var MCellDelegateFunctions = (function(){
    function clickedOnMine() {
      this.lost = true;
      this.delegate.MMapPlayerLost();
    }
    function openedField() {
      this.opened++;
      if(this.opened >= this.openCountForWin && !this.lost) {
        this.delegate.MMapPlayerWon();
      }
    }
    return function(){
      this.clickedOnMine = clickedOnMine;
      this.openedField = openedField;
      return this;
    }
  })();

  MClientInterfaceMethods.call(MMap.prototype);
  MCellDelegateFunctions.call(MMap.prototype);

  return MMap;
});