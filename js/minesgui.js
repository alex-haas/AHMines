define(['globals'], function (Globals) {
  'use strict';

  var MGUI = {};

  MGUI.prototype.fillMinesContainer = function(){
  	var container = document.getElementById('minesweeper-container');
  	if(!container) {
  		throw 'container doesnt exist';
  	}

  	MINES.minescontainer = container[0];
  	MINES.minescontainer.innerHTML = renderHTML();
  	MINES.onOpenFieldListener = onOpenFieldListener;
  	MINES.onFlagFieldListener = onFlagFieldListener;
  	MINES.onLose = onLose;
		MINES.onWin = onWin;
		MINES.onFlagAmountChanged = onFlagAmountChanged;

  	window.setTimeout(setOnFieldClickListener, 0);
  	window.setTimeout(setControlListener, 0);
  	window.setTimeout(timerUpdate, 0);
  }

  MGUI.prototype.clientCallbackListener = {
  	onOpenFieldListener: function(fieldsToOpen, fieldsToOpenNext){

  	},
    onFlagFieldListener: function(fieldToFlag){

    },
    onLose: function(){

    },
    onWin: function(){

    },
    onReset: function(){

    },
    onFlagAmountChanged: function(flagsLeft){
    	
    },
  }

  return MGUI;

  

  var onLose = function(){
  	alert("you lose!");
  };
	
	var onWin = function(){
		alert("gratulations! you win!");
	};

	var onFlagAmountChanged = function(flagsLeft){
		$('#mmine-counter').html(flagsLeft);
	};

  var onFlagFieldListener = function(fieldToFlag){
  	var div = getFieldOnPosition(fieldToFlag.x, fieldToFlag.y);
  	if(fieldToFlag.isFlagged) div.addClass("mflag");
  	else div.removeClass("mflag");
  };

  var renderHTML = function(){
    var htmlControls = renderHTMLControls();
    var htmlFields = renderHTMLFields();
    return htmlControls + htmlFields;
  };

  var setControlListener = function(){
  	$("#assist-level-selector").change(setChangeAssistLevelListener);
  };

  var setChangeAssistLevelListener = function(){
  	var newSelectedLevel = parseFloat($("#assist-level-selector option:selected").attr('value'));
  	MINES.assistLevel = newSelectedLevel;
  };

  var renderHTMLControls = function(){
    var html = '<div class="controls">';

    html += renderHTMLControlLevelSelector();
    html += '<div class="spacer"></div>';
    html += renderHTMLTimeCounter();
    html += '<div class="spacer"></div>';
    html += renderHTMLMineCounter();

    html += '<div style="clear:both"></div></div>';
    return html;
  };

  var renderHTMLMineCounter = function(){
  	return '<div class="mmineicon"></div><div id="mmine-counter" class="miconlabel">99</div>';
  };

  var renderHTMLTimeCounter = function(){
  	return '<div class="mtimeicon"></div><div id="mtime-counter" class="miconlabel">0:00</div>';
  };

  var renderHTMLControlLevelSelector = function(){
  	var maxLevel = 5;
    var html = '<select id="assist-level-selector" style="float:left">';
    for(var i=0; i<=maxLevel; ++i){
      html += '<option value="' + i + '"'+(i===maxLevel?' selected':'')+'>Assist Level ' + i + '</option>';
    }
    html += '</select>';
    return html;
  };

  var renderHTMLFields = function(){
		var rows = MINES.mMap.rows;
		var cols = MINES.mMap.cols;

		var htmlmap = '<div class="mmap">';
		var i=0;
		for(var y=0; y<rows; y++){
			htmlmap += '<div id="' + y + '" class="mrow">';
			for(var x=0; x<cols; ++x, ++i){
				htmlmap += '<div id="' + x + '" class="mfield" mfieldx="' + x + '" mfieldy="' + y + '"></div>';
			}
			htmlmap += '</div><div style="clear:both"></div>';
		}
		htmlmap += '</div>';
		return htmlmap;
	};

	var getFieldOnPosition = function(x,y){
		var row = $('#' + y + '.mrow');
		return $('#' + x + '.mfield', row);
	};

	var onOpenFieldListener = function(fieldsToOpen, fieldsToOpenNext){
		for(var i=fieldsToOpen.length-1; i>=0; --i){
			var mField = fieldsToOpen[i];
			var div = getFieldOnPosition(mField.x, mField.y);
			div.addClass('mopen');
			if(mField.isMine) div.addClass("mmine");
			else if(mField.isFlag) alert("shouldn't be called here oO");
			else div.addClass('m' + mField.minesAround);
		}

		window.setTimeout(function(){
			MINES.openFields(fieldsToOpenNext);
		},200);
	};

	var onFieldClickListener = function(event){
		var button = event.target;
		var mFieldX = parseInt(button.getAttribute("mfieldx"));
		var mFieldY = parseInt(button.getAttribute("mfieldy"));
		MINES.clickedAtField(mFieldX,mFieldY);
	};

	var onRightClickListener = function(event){
		event.preventDefault();

		var button = event.target;
		var mFieldX = parseInt(button.getAttribute("mfieldx"));
		var mFieldY = parseInt(button.getAttribute("mfieldy"));
		MINES.flagField(mFieldX,mFieldY);
	};

	var onDoubleClickListener = function(event){
		var button = event.target;
		var mFieldX = parseInt(button.getAttribute("mfieldx"));
		var mFieldY = parseInt(button.getAttribute("mfieldy"));
		MINES.openMinesAroundOpenField(mFieldX,mFieldY);
	};

	var setOnFieldClickListener = function(){
		var jFields = $(".mfield");
		
		// Left click
		jFields.unbind("click");
		jFields.click(onFieldClickListener);
		
		// Right click
		jFields.unbind("contextmenu");
		jFields.bind("contextmenu", onRightClickListener);

		// Double click
		jFields.unbind("dblclick");
		jFields.dblclick(onDoubleClickListener);
	};

	// TODO: needs to be started in an other function
	var timerUpdate = function(){
  	var secondsPassed = MINES.secondsPassed();

  	var seconds = secondsPassed % 60;
		var minutes = Math.floor(secondsPassed / 60);
		var secondsStr = seconds < 10 ? '0'+seconds : seconds;
		$('#mtime-counter').html(minutes + ':' + secondsStr);

  	setTimeout(timerUpdate, 1000);
  }

});
