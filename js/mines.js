'use strict';

requirejs.config({
    baseUrl: 'js',
    paths: {
    }
});

define(['globals','localminesclient','minesgui'], function(Globals, LocalMinesClient, MinesGUI) {
  console.log("loading completed");

  Globals.setClient(LocalMinesClient);


  var cols = 30;
  var rows = 16;
  var mines = 99;

  LocalMinesClient.init(cols,rows,mines);
  LocalMinesClient.assistLevel = 999;
  MinesGUI.fillMinesContainer();
});
