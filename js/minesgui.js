(function () {
  'use strict';

  MINES.fillMinesContainer = function(){
  	var container = $("#minesweeper-container");
  	if(container.length < 1) return;
  	MINES.minescontainer = container[0];
  	MINES.minescontainer.innerHTML = renderHTML();
  	MINES.onOpenFieldListener = onOpenFieldListener;
  	MINES.onFlagFieldListener = onFlagFieldListener;

  	window.setTimeout(setOnFieldClickListener, 0);
  };

  var onFlagFieldListener = function(fieldToFlag){
  	var div = getFieldOnPosition(fieldToFlag.x, fieldToFlag.y);
  	if(fieldToFlag.isFlagged) div.addClass("mflag");
  	else div.removeClass("mflag");
  };

  var renderHTML = function(){
		var rows = MINES.mMap.rows;
		var cols = MINES.mMap.cols;

		var htmlmap = "";
		var i=0;
		for(var y=0; y<rows; y++){
			htmlmap += '<div id="' + y + '" class="mrow">';
			for(var x=0; x<cols; ++x, ++i){
				htmlmap += '<div id="' + x + '" class="mfield" mfieldx="' + x + '" mfieldy="' + y + '"></div>';
			}
			htmlmap += '</div><div style="clear:both"></div>';
		}
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

})();
