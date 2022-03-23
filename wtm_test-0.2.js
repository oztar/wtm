'use strict'
let interval;

const pkg = {
    author      : 'Alfredo Roman',
    license     : 'ISC',
    version     : '0.2',
    compatible  : '0.3.5',
    description : 'Module for test automatic interval'
};

const load = function(socketID){
    this.emit(socketID,'Initial Test');
    interval = setInterval( ()=>{
	if( socketID != null){
	    this.emit(socketID,'Module->test');
	}
    },1000);
}

const unload = function(socketID){
    clearInterval(interval);
    if( socketID != null){
	this.emit(socketID,'Unload Module TEST');
    }
}
module.exports = {
    pkg,
    command : {},
    load,
    unload,
    autoload :true
}
