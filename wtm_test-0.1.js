'use strict'
let interval;

const load = function(socketID){
    interval = setInterval( function(){
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
