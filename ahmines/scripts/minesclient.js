
define(function () {
  'use strict';

  // MineClient is an abstract class
  var MineClient = function(){};
  MineClient.prototype = {
    /* Callbacks */
    delegate: {
      onOpenFieldListener: function(fieldsToOpen, fieldsToOpenNext){},
      onFlagFieldListener: function(fieldToFlag){},
      onLose: function(){},
      onWin: function(){},
      onReset: function(){},
      onFlagAmountChanged: function(flagsLeft){},
    },

    /* attributes */
    assistLevel: 0,

    /* public methods */
    init: function(cols,rows,mines){},
    reset: function(){},

    setAssistLevel: function(newAssistLevel){},
    getAssistLevel: function(){},
  };

  var TimeMeasuringFunctions = (function(){
    function setGameStartTime(millis) {
      this.startTime = millis;
    }
    function getGameStartTime() {
      return this.startTime;
    }
    function getSecondsPassed() {
      if(!this.startTime || this.startTime === 0) return 0;

      var milliPassed = (new Date).getTime() - this.startTime;
      return Math.floor(milliPassed / 1000);
    }
    return function(){
      this.startTime = 0;
      this.setGameStartTime = setGameStartTime;
      this.getGameStartTime = getGameStartTime;
      this.getSecondsPassed = getSecondsPassed;
      return this;
    }
  })();

  TimeMeasuringFunctions.call(MineClient.prototype);
  
  return MineClient;
});