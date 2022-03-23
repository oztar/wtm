'use strict'

const u = require('util').format;

const pkg = {
    author      : 'Alfredo Roman',
    license     : 'ISC',
    version     : '0.1',
    compatible  : '0.3.5',
    description : 'Module list router stack'
};

const webCon = {
    version : '0.1',
    description : 'Express List Webs',
    usage : 'web <type> <filter>',
    auto  : null//['option1','option2']  //or null
}
webCon.usage += '\r\n\tExample:';
webCon.usage += '\r\n\t\tweb';
webCon.usage += '\r\n\t\tweb name query';
webCon.usage += '\r\n\t\tweb name html';

const web = function(socketID,args){
    try{
	for( let x in this.options.app._router.stack){
	    if( args[2] !== undefined){
		if( args[2] != this.options.app._router.stack[x][args[1]]){continue;}
	    }
	    this.emit(socketID,u(this.options.app._router.stack[x]));
	}
    }catch(e){
	this.emit(socketID+'err',e);
   }
}

module.exports = {
    pkg,
    command : {
	web : webCon
    },
    web,
    autoload : false
}
