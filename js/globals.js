define(function() {
	'use strict';
	
	var Globals = function(){};

	Object.defineProperty(Globals.prototype, 'localClient', 	{writable: true});
	Object.defineProperty(Globals.prototype, 'remoteClient', 	{writable: true});
	Object.defineProperty(Globals.prototype, 'gui', 					{writable: true});
	Object.defineProperty(Globals.prototype, 'currentClient', {writable: true});

	return Globals;
});