define(function(){
  'use strict';
  
  var MCell = {
    x: 0,
    y: 0,
    isMine: false,
    isOpened: false,
    isFlagged: false,
    minesAround: 0,
    flaggedAround: 0,
    closedAround: 0,
    neighbors: []
  };

  MCell.prototype.constructor = function(x,y){
    this.x = x;
    this.y = y;
  };

  MCell.prototype.toString = function(){
    return "[Cell x:"+this.x+" y:"+this.y+" minesAround:"+this.minesAround+" closedAround:"+this.closedAround+"]";
  };

  MCell.prototype.open = function(){
    if(this.isOpened || this.isFlagged) return false;
    this.isOpened = true;
    this.refreshMinesAround();
    this.refreshFlaggedAround();
    
    if(this.isMine){
      if(!MINES.mMap.lost){
        MINES.onLose();
      }
      MINES.mMap.lost = true;
    }

    return true;
  }

  MCell.prototype.getChainTriggeredFields = function() {
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

    if(MINES.assistLevel >= 2){
      this.refreshClosedAround();
      var ownClosed = [], sharedClosed = [], otherClosed = [];
      for(var i=this.neighbors.length-1; i>=0; --i){
        var f = this.neighbors[i];
        if(!f.isOpened || ( f.x !== this.x && f.y !== this.y ) ) continue;  // not opened 
        if(f.minesAround === 0 || this.minesAround === 0) continue;
        f.refreshClosedAround();
        this.splitClosedFields(f, ownClosed, sharedClosed, otherClosed);


        var sharedMinesByThis  = ((this.closedAround - this.minesAround ) - sharedClosed.length) * -1;
        var sharedMinesByOther = ((f.closedAround    - f.minesAround    ) - sharedClosed.length) * -1;
        if(sharedMinesByThis  === f.minesAround){
          chainTriggered = chainTriggered.concat(otherClosed.diff(sharedClosed));
        }
        if(sharedMinesByOther === this.minesAround){
          chainTriggered = chainTriggered.concat(ownClosed.diff(sharedClosed));
        }
        if(MINES.assistLevel >= 3){
          //if(diff === this.minesAround){
          //  MINES.mMap.flagField(ownFields);
          //}
        }
      }
    }

    return chainTriggered;
  }

  MCell.prototype.refreshMinesAround = function(){
    var count = 0;
    for(var i=this.neighbors.length-1; i>=0; i--){
      if(this.neighbors[i].isMine) ++count;
    }
    this.minesAround = count;
  };

  MCell.prototype.refreshFlaggedAround = function(){
    var count = 0;
    for(var i=this.neighbors.length-1; i>=0; --i){
      if(this.neighbors[i].isFlagged) ++count;
    }
    this.flaggedAround = count;
  };

  MCell.prototype.refreshClosedAround = function(){
    var count = 0;
    for(var i=this.neighbors.length-1; i>=0; --i){
      if(!this.neighbors[i].isOpened) ++count;
    }
    this.closedAround = count;
  };

  MCell.prototype.splitClosedFields = function(otherField, ownClosed, sharedClosed, otherClosed){
    while (sharedClosed.length) sharedClosed.pop(); // clear
    while (otherClosed.length)  otherClosed.pop();  // clear

    // get own closed fields
    if(ownClosed.length !== 0){
      for(var i=this.neighbors.length-1; i>=0; --i){
        if(!this.neighbors[i].isOpened){
          ownClosed.push(this.neighbors[i]);
        }
      }
    }

    var f;
    for(var i=otherField.neighbors.length-1; i>=0; --i){
      f = otherField.neighbors[i];
      if(!f.isOpened){
        otherClosed.push(f);
        for(var j=this.neighbors.length-1; j>=0; --j){
          if(this.neighbors[j] === f){
            sharedClosed.push(f);
          }
        }
      }
    }
  };

  return MCell;
});