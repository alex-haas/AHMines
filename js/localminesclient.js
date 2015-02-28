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
  };

  LocalMinesClient.prototype.reset = function(){
  	// TODO: test later
  	this.mMap = new MMap(this.mMap.cols, this.mMap.rows, this.mMap.mines);
    //this.init();
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
  	return MINES.mMap.secondsPassed();
  }

  return LocalMinesClient;
});