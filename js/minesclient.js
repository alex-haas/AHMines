
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
    startTime: 0,

    /* public methods */
    init: function(cols,rows,mines){},
    reset: function(){},

    setAssistLevel: function(newAssistLevel){},
    getAssistLevel: function(){},

    getGameStartTime: function(){
      if(this.startTime === 0) return 0;

      var milliPassed = (new Date).getTime() - this.startTime;
      return Math.floor(milliPassed / 1000);
    }
  };
  
  return MineClient;
});