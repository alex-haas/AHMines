'use strict';

requirejs.config({
    baseUrl: 'js',
    paths: {
    }
});

define(['globals','localminesclient','minesgui'], function(Globals, LocalMinesClient, MinesGUI) {
  console.log("loading completed");

  Globals.currentClient = new LocalMinesClient;
  Globals.gui = new MinesGUI;

  var cols = 30;
  var rows = 16;
  var mines = 99;

  Globals.currentClient.init(cols,rows,mines);
  Globals.currentClient.assistLevel = 999;
  
  Globals.gui.init();
});
