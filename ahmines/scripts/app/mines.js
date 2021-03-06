'use strict';

define(['globals','localminesclient','minesgui'], function(Globals, LocalMinesClient, MinesGUI) {
  Globals.currentClient = new LocalMinesClient;
  Globals.gui = new MinesGUI;

  $(document).ready(function() {
    var cols = 16;
    var rows = 16;
    var mines = 16;

    Globals.currentClient.init(cols,rows,mines);
    Globals.currentClient.assistLevel = 999;

    Globals.gui.init();
  });
  
});
