/**
  LocalMinesClient creates a local MMap and let the user play without internet connection. 
*/

define(['minesclient','map/mmap'], function(MinesClient, MMap){
	'use strict';
	
  var LocalMinesClient = function(){};
  
  LocalMinesClient.prototype = Object.create(MinesClient.prototype);
  LocalMinesClient.prototype.constructor = LocalMinesClient;
  LocalMinesClient.prototype.mMap = null;   // TODO: is there a better solution for attributes?

  LocalMinesClient.prototype.init = function(cols,rows,mines){
  	this.__proto__.__proto__.init(cols,rows,mines);
    this.mMap = new MMap(cols,rows,mines);
    this.mMap.callbacks = this.mMapCallbacks;
  };

  LocalMinesClient.prototype.reset = function(){
  	// TODO: test later
  	this.mMap = new MMap(this.mMap.cols, this.mMap.rows, this.mMap.mines);
    //this.init();
  };

  LocalMinesClient.prototype.mMapCallbacks = {
    openFields: function(cellsToOpen, TriggeredCells){
      console.log('LocalMinesClient: opening fields!');
      console.log(this);
      this.callbacks.onOpenFieldListener(cellsToOpen, TriggeredCells);
    },
    fieldFlagged: function(field){
      this.callbacks.onFlagFieldListener(field);
    },
    flagAmountChanged: function(newAmount){
      this.callbacks.onFlagAmountChanged(newAmount);
    }
  };

  LocalMinesClient.prototype.clickedAtField = function(x,y){
    this.mMap.clickedAtField(x,y);
  };

  LocalMinesClient.prototype.flagField = function(x,y){
    this.mMap.flagField(x,y);
  };

  LocalMinesClient.prototype.openMinesAroundOpenField = function(x,y){
    this.mMap.openMinesAroundOpenField(x,y);
  };

  // Call when the fieldsToOpenNext array has a length above 0
  LocalMinesClient.prototype.openFields = function(fieldsToOpen){
    this.mMap.openFields(fieldsToOpen);
  };

  LocalMinesClient.prototype.secondsPassed = function(){
  	return this.mMap.secondsPassed();
  }

  return LocalMinesClient;
});