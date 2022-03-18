'use strict'
//version 0.1
let interval;

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
    command : {},
    load,
    unload,
    autoload :true
}
