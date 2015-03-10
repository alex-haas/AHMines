define(['globals'], function (Globals) {
  'use strict';

  var MGUI = function(){};

  MGUI.prototype.init = function(){
    Globals.currentClient.delegate = this;

  	this.minescontainer = document.getElementById('minesweeper-container');
  	if(!this.minescontainer) {
  		throw 'container doesnt exist';
  	}
  	this.minescontainer.innerHTML = this.renderHTML();

  	window.setTimeout(this.setOnFieldClickListener.bind(this), 2000);
  	window.setTimeout(this.setControlListener.bind(this), 2000);
  	window.setTimeout(this.timerUpdate.bind(this), 2000);
  }
  MGUI.prototype.constructor = MGUI;

  var HTMLRenderingFunctions = (function(){
    function renderHTML() {
      var htmlControls = this.renderHTMLControls();
      var htmlFields = this.renderHTMLFields();
      return htmlControls + htmlFields;
    }
    function renderHTMLControls() {
      var html = '<div class="controls">';

      html += this.renderHTMLControlLevelSelector();
      html += '<div class="spacer"></div>';
      html += '<div class="mtimeicon"></div><div id="mtime-counter" class="miconlabel">0:00</div>';
      html += '<div class="spacer"></div>';
      html += '<div class="mmineicon"></div><div id="mmine-counter" class="miconlabel">99</div>';

      html += '<div style="clear:both"></div></div>';
      return html;
    }
    function renderHTMLControlLevelSelector() {
      var maxLevel = 5;
      var html = '<select id="assist-level-selector" style="float:left">';
      for(var i=0; i<=maxLevel; ++i){
        html += '<option value="' + i + '"'+(i===maxLevel?' selected':'')+'>Assist Level ' + i + '</option>';
      }
      html += '</select>';
      return html;
    }
    function renderHTMLFields() {
      var rows = Globals.currentClient.mMap.rows;
      var cols = Globals.currentClient.mMap.cols;

      var htmlmap = '<div class="mmap">';
      var i=0;
      for(var y=0; y<rows; y++){
        htmlmap += '<div id="mrow' + y + '" class="mrow">';
        for(var x=0; x<cols; ++x, ++i){
          htmlmap += '<div class="mfield" mfieldx="' + x + '" mfieldy="' + y + '"></div>';
        }
        htmlmap += '</div><div style="clear:both"></div>';
      }
      htmlmap += '</div>';
      return htmlmap;
    }
    return function() {
      this.renderHTML = renderHTML;
      this.renderHTMLControls = renderHTMLControls;
      this.renderHTMLControlLevelSelector = renderHTMLControlLevelSelector;
      this.renderHTMLFields = renderHTMLFields;
      return this;
    }
  })();

	/** Client Callbacks **/
  var MClientCallbackFunctions = (function() {
    function addClass(elem, c) {
      elem.className += ' '+c;
    }
    function removeClass(elem, c) {
      elem.className.replace(c, '');
    }
    function onOpenFieldListener(fieldsToOpen, fieldsToOpenNext) {
      for(var i=fieldsToOpen.length-1; i>=0; --i){
        var mField = fieldsToOpen[i];
        var div = this.getFieldOnPosition(mField.x, mField.y);
        addClass(div,'mopen');
        if(mField.isMine) addClass(div, 'mmine');
        else if(mField.isFlag) alert("shouldn't be called here oO");
        else addClass(div, 'm' + mField.minesAround);
      }

      if(fieldsToOpenNext.length > 0){
        window.setTimeout(function(){
          Globals.currentClient.openFields(fieldsToOpenNext);
        },200);
      }
    }
    function onFlagFieldListener(fieldToFlag) {
      console.log('field got flagged'+fieldToFlag);
      var div = this.getFieldOnPosition(fieldToFlag.x, fieldToFlag.y);
      if(fieldToFlag.isFlagged) addClass(div,'mflag');
      else removeClass(div,'mflag');
    }
    function onLose() {
      window.setTimeout(function(){
        alert("you lose!");
      },0); 
    }
    function onWin() {
      window.setTimeout(function(){
        alert("gratulations! you win!");
      },0);
    }
    function onReset() {
      console.log('reset was executed');
    }
    function onFlagAmountChanged(flagsLeft) {
      console.log('amount of flags changed to: '+flagsLeft);

      // TODO: getting the elements should ne done in an init method
      document.getElementById('mmine-counter').innerHTML = flagsLeft;
    }
    return function() {
      this.onOpenFieldListener = onOpenFieldListener;
      this.onFlagFieldListener = onFlagFieldListener;
      this.onLose = onLose;
      this.onWin = onWin;
      this.onReset = onReset;
      this.onFlagAmountChanged = onFlagAmountChanged;
      return this;
    }
  })();

  var MinesGUIClientUtilFunctions = (function(){
    function getFieldOnPosition(x,y) {
      var row = document.getElementById('mrow'+y);
      return row.children[x];
    }
    return function(){
      this.getFieldOnPosition = getFieldOnPosition;
      return this;
    }
  })(); 

  var HTMLListenerFunctions = (function(){
    function setControlListener() {
      var assistLevelControl = document.getElementById('assist-level-selector');
      assistLevelControl.onchange = this.setChangeAssistLevelListener;
    }
    function setChangeAssistLevelListener() {
      var assistLevelControl = document.getElementById('assist-level-selector');
      var newSelectedLevel = parseInt(e.options[e.selectedIndex].value);
      Globals.currentClient.assistLevel = newSelectedLevel;
    }
    function onFieldClickListener(event) {
      var button = event.target;
      var mFieldX = parseInt(button.getAttribute('mfieldx'));
      var mFieldY = parseInt(button.getAttribute('mfieldy'));

      console.log('GUI: left click on Cell[X:'+mFieldX+', Y:'+mFieldY+']');
      Globals.currentClient.clickedAtField(mFieldX,mFieldY);
    }
    function onRightClickListener(event) {
      event.preventDefault();

      var button = event.target;
      var mFieldX = parseInt(button.getAttribute('mfieldx'));
      var mFieldY = parseInt(button.getAttribute('mfieldy'));

      console.log('GUI: right click on Cell[X:' + mFieldX + ', Y:' + mFieldY + ']');
      Globals.currentClient.flagField(mFieldX,mFieldY);
    }
    function onDoubleClickListener(event) {
      var button = event.target;
      var mFieldX = parseInt(button.getAttribute('mfieldx'));
      var mFieldY = parseInt(button.getAttribute('mfieldy'));
      Globals.currentClient.openMinesAroundOpenField(mFieldX,mFieldY);
    }
    function onDoubleClickListener(event) {
      var button = event.target;
      var mFieldX = parseInt(button.getAttribute('mfieldx'));
      var mFieldY = parseInt(button.getAttribute('mfieldy'));
      Globals.currentClient.openMinesAroundOpenField(mFieldX,mFieldY);
    }
    function setOnFieldClickListener() {
      var jFields = $('.mfield');
      
      // Left click
      jFields.unbind('click');
      jFields.click(this.onFieldClickListener);
      
      // Right click
      jFields.unbind('contextmenu');
      jFields.bind('contextmenu', this.onRightClickListener);

      // Double click
      jFields.unbind('dblclick');
      jFields.dblclick(this.onDoubleClickListener);
    }
    return function(){
      this.setControlListener = setControlListener;
      this.setChangeAssistLevelListener = setChangeAssistLevelListener;
      this.onFieldClickListener = onFieldClickListener;
      this.onRightClickListener = onRightClickListener;
      this.onDoubleClickListener = onDoubleClickListener;
      this.onDoubleClickListener = onDoubleClickListener;
      this.setOnFieldClickListener = setOnFieldClickListener;
      return this;
    }
  })();

	MGUI.prototype.timerUpdate = function(){
  	var secondsPassed = Globals.currentClient.getSecondsPassed();

  	var seconds = secondsPassed % 60;
		var minutes = Math.floor(secondsPassed / 60);
		var secondsStr = seconds < 10 ? '0'+seconds : seconds;
		$('#mtime-counter').html(minutes + ':' + secondsStr);

  	window.setTimeout(this.timerUpdate, 1000);
  }

  HTMLRenderingFunctions.call(MGUI.prototype);
  MClientCallbackFunctions.call(MGUI.prototype);
  MinesGUIClientUtilFunctions.call(MGUI.prototype);
  HTMLListenerFunctions.call(MGUI.prototype);

  return MGUI;
});
