'use strict'
const wfs = require('fs');
const u   = require('util').format;

const errors = {
    PATH         : 'Path not found \r\n %s',
    USAGE        : 'Arguments error, using help \t\n OR help usage fs',
    UNDEFINED    : '%s internal error: \r\n %s'
};


/* print working directory */
const pwdCon = {
    description : 'pwd print working directory ',
    usage : 'pwd',
    auto  : null
}
const pwd =  function(socketID,args){
    this.emit(socketID,__dirname);
}


/* FILE SISTEM */
const fsCon = {
    version : '0.1',
    description : 'fs',
    usage : 'fs [ls]',
    auto  : ['ls']  //or null
}

const fs = function(socketID,args){
    try{
	if( args[1] === undefined){ 
	    this.emit(socketID+'err', u(errors['USAGE']));
	    return;
	}
	this['wtm_fs_'+args[1]](socketID,args);
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'fs',e));
   }
}

const ls = function(socketID,args){
    if( args[2] === undefined){
	this.emit(socketID+'err', u(errors['USAGE']));
	return;
    }
    wfs.readdir(args[2], (e, files) => {
	if (e)
	    this.emit(socketID+'err', u(errors['UNDEFINED'],'fs',e));
	else {
	    this.emit(socketID,u('Current directory %s:',args[2]));
	    files.forEach(file => {
		this.emit(socketID,'\t'+file);
	    })
	}
    });
}

module.exports = {
    command : {
	fs : fsCon,
	pwd: pwdCon
    },
    fs,
    pwd,
    ls,
    autoload : false
}
