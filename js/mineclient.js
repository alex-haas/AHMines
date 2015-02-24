
define(function () {
  'use strict';

  // MineClient is an abstract class
  var MineClient = {
    /* Callbacks */
    onOpenFieldListener: null,
    onFlagFieldListener: null,
    onLose: null,
    onWin: null,
    onReset: null,
    onFlagAmountChanged: null,

    /* public methods */
    init: function(cols,rows,mines){},
    reset: function(){},

    setAssistLevel: function(newAssistLevel){},
    getAssistLevel: function(){},

    getGameStartTime: function(){}
  };

  // Callbacks with stubs
  MINES.onOpenFieldListener = function(fieldsToOpen, fieldsToOpenNext){};
  MINES.onFlagFieldListener = function(fieldToFlag){};
  MINES.onLose = function(){};
  MINES.onWin = function(){};
  MINES.onReset = function(){};
  MINES.onFlagAmountChanged = function(flagsLeft){};

  // public attributes
  MINES.assistLevel = 0;  // default deactivated

  // public methods
  MINES.init = function(cols,rows,mines){
    MINES.mMap = new MMap(cols,rows,mines);
  };
  MINES.reset = function(){
    MINES.init(MINES.mMap.cols, MINES.mMap.rows, MINES.mMap.mines);
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
  MINES.secondsPassed = function(){
  	return MINES.mMap.secondsPassed();
  }

///// MField Implementation ///////////////////////////////////////////////////////////////////////////////////////////
  

///// MMap Implementation ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
})();