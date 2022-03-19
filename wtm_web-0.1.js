'use strict'

const u = require('util').format;

const nameCon = {
    version : '0.1',
    description : 'Express List Webs',
    usage : 'web [type] [filter]',
    auto  : null//['option1','option2']  //or null
}


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

/*
  the modules not need commands
  you use other events, and other code. 
    
  autoload is true you using Load and Unload for module. 
  const load = function(socketID){}
  const unload = function(socketID){}
*/

module.exports = {
    command : {
	web : nameCon
    },
    web,
    autoload : false
}
