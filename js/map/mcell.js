define(['globals'], function(Globals){
  'use strict';
  
  var MCell = function(x,y){
    this.x = x;
    this.y = y;

    this.isMine = false,
    this.isOpened = false,
    this.isFlagged = false,
    this.minesAround = 0,
    this.flaggedAround = 0,
    this.closedAround = 0,
    this.neighbors = [],
    this.delegate = {
      clickedOnMine: function(x,y){}
    }
  };

  var MCellFunctions = (function(){
    function toString() {
      return "[Cell x:"+this.x+" y:"+this.y+" minesAround:"+this.minesAround+" closedAround:"+this.closedAround+"]";
    }
    function open() {
      if(this.isOpened || this.isFlagged) return false;
      this.isOpened = true;
      this.refreshMinesAround();
      this.refreshFlaggedAround();
      
      if(this.isMine){
        this.delegate.clickedOnMine();
      }

      return true;
    }
    function getChainTriggeredFields() {
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

      if(Globals.currentClient.assistLevel >= 2){
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
          if(Globals.currentClient.assistLevel >= 3){
            //if(diff === this.minesAround){
            //  MINES.mMap.flagField(ownFields);
            //}
          }
        }
      }

      return chainTriggered;
    }
    function refreshMinesAround() {
      var count = 0;
      for(var i=this.neighbors.length-1; i>=0; i--){
        if(this.neighbors[i].isMine) ++count;
      }
      this.minesAround = count;
    }
    function refreshFlaggedAround() {
      var count = 0;
      for(var i=this.neighbors.length-1; i>=0; --i){
        if(this.neighbors[i].isFlagged) ++count;
      }
      this.flaggedAround = count;
    }
    function refreshClosedAround() {
      var count = 0;
      for(var i=this.neighbors.length-1; i>=0; --i){
        if(!this.neighbors[i].isOpened) ++count;
      }
      this.closedAround = count;
    }
    function splitClosedFields(otherField, ownClosed, sharedClosed, otherClosed) {
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
    }
    return function() {
      this.toString = toString;
      this.open = open;
      this.getChainTriggeredFields = getChainTriggeredFields;
      this.refreshMinesAround = refreshMinesAround;
      this.refreshFlaggedAround = refreshFlaggedAround;
      this.refreshClosedAround = refreshClosedAround;
      this.splitClosedFields = splitClosedFields;
      return this;
    }
  })();

  MCellFunctions.call(MCell.prototype); // adding MCellFunctions to MCell prototype

  return MCell;
});