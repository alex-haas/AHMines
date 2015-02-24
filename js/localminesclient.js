/**
  LocalMinesClient creates a local MMap and let the user play without internet connection. 
*/

define function(['minesclient'], minesclient){

  var LocalMinesClient = {

  };

  LocalMinesClient.prototype = Object.create(minesclient.prototype);
  //LocalMinesClient.prototype.constructor = function(){};


  return LocalMinesClient;
}