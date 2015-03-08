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
    this.mMap.delegate = this;
  };
  LocalMinesClient.prototype.reset = function(){
  	// TODO: test later
  	this.mMap = new MMap(this.mMap.cols, this.mMap.rows, this.mMap.mines);
    //this.init();
  };

  var MMapDelegateFunctions = (function(){
    function MMapOpenFields(cellsToOpen, TriggeredCells) {
      this.delegate.onOpenFieldListener(cellsToOpen, TriggeredCells);
    }
    function MMapFieldFlagged(field) {
      this.delegate.onFlagFieldListener(field);
    }
    function MMapFlagAmountChanged(newAmount) {
      this.delegate.onFlagAmountChanged(newAmount);
    }
    return function(){
      this.MMapOpenFields = MMapOpenFields;
      this.MMapFieldFlagged = MMapFieldFlagged;
      this.MMapFlagAmountChanged = MMapFlagAmountChanged;
      return this;
    }
  })();

  var GUIActionFunctions = (function(){
    function clickedAtField(x,y) {
      this.mMap.openField(this.mMap.cells[y][x]);
    }
    function flagField(x,y) {
      this.mMap.flagField(x,y);
    }
    function openMinesAroundOpenField(x,y) {
      this.mMap.openMinesAroundOpenField(x,y);
    }
    function openFields(fieldsToOpen) {
      this.mMap.openFields(fieldsToOpen);
    }
    return function(){
      this.clickedAtField = clickedAtField;
      this.flagField = flagField;
      this.openMinesAroundOpenField = openMinesAroundOpenField;
      this.openFields = openFields;
      return this;
    }
  })();

  MMapDelegateFunctions.call(LocalMinesClient.prototype);
  GUIActionFunctions.call(LocalMinesClient.prototype);

  return LocalMinesClient;
});