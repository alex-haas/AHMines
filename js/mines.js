requirejs.config({
    baseUrl: 'js',
    paths: {
    }
});

define('globals', function() {
  var client = {};
  return {
    getClient: function(){ 
      return client; 
    },
    setClient: function(newClient){ 
      client = newClient; 
    }
  };
});

require(['globals','localminesclient','minesgui'], function(globals, localminesclient, minesgui) {
  console.log("loading completed");

  globals.setClient(localminesclient);


  var cols = 30;
  var rows = 16;
  var mines = 99;

  MINES.init(cols,rows,mines);
  MINES.assistLevel = 999;
  MINES.fillMinesContainer();
});
