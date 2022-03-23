'use strict'
let j = {};
let options = {};

const u = require('util').format;
const name = __filename.split(/[\\/]/).pop().replace('.js','');

const memoCon = {
    description : 'memo Memory control set',
    usage : 'memo [ls|set|config|lsconfig]',
    auto  : ['ls','set','lsconfig','config']  //or null
}

memoCon.usage += '\r\n\tls\t\t\tList of memory, Arrays, Objects,functions...';
memoCon.usage += '\r\n\tset\t\t\tAdd or remplace, variable in memory';
memoCon.usage += '\r\n\t\t\t\tExample';
memoCon.usage += '\r\n\t\t\t\t\tmemo set key value';
memoCon.usage += '\r\n\t\t\t\t\tmemo set pr key value';
memoCon.usage += '\r\n\t\t\t\t\tmemo set pr:[] key value';
memoCon.usage += '\r\n\tconfig\t\tConfigure in module where memory using';
memoCon.usage += '\r\n\t\t\t\tExample';
memoCon.usage += '\r\n\t\t\t\t\tmemo config ../services config  -> javascript code : require("../services").config';
memoCon.usage += '\r\n\tlsconfig\tList config vars';

const memo = function(socketID,args){
    try{
	if( this[name+'_'+args[1] ] !== undefined){
	    this[name+'_'+args[1]](socketID,args);
	    return;
	}
	this.emit(socketID+'err','Help usage m');
    }catch(e){
	this.emit(socketID+'err',u(e));
    }

}

const ls = function(socketID,args){
    try{
	//headers
	let txt = 'List: j';
	let cols ='name\t\tvalue\r\n';

	// memori of list
	let x = j;
	if ( args[2] !== undefined){
	    for( let i=2 ;i< args.length;i++){
		txt += '.'+args[i];
		x = x[args[i]];
	    }
	}

	//list
	for( let i in x){
	    const z = u('%s',x[i]);
	    
	    cols += this.f.col(i,0);
	    cols += z.substring(0,20);
	    cols += '\r\n';
	}


	//print screen
	this.emit(socketID,u(txt));
	this.emit(socketID,u(cols));
    }catch(e){
	this.emit(socketID+'err',u(e));
   }
}
const transVarType = function(dat){
    if( dat == '{}'){
	return {};
    }
    if( dat == '[]'){
	return [];
    }
    return {};
}
const instype = function(dat){
    if( dat instanceof Array){
	return 'Array';
    }
    if( dat instanceof Object){
	return 'Object';	 
    }
    return '=';
}


const set = function(socketID,args){
    try{
	let txt = 'List: j';

	let x = j;
	if ( args[2] !== undefined){
	    for( let i=2 ;i< (args.length-2);i++){
		let vartype = args[i].split(':');

		if(  x[ vartype[0] ] === undefined && vartype[1] === undefined){
		    vartype[1] = {};
		    x[ vartype[0] ] = Object.assign(vartype[1]);
		}else if( vartype[1] !== undefined){
		    vartype[1] = transVarType(vartype[1])
		    if( instype(vartype[1]) != instype( x[ vartype[0] ]) ){
			x[ vartype[0] ] = Object.assign(vartype[1]);
		    }
		}else{
		    vartype[1] =instype(x[ vartype[0] ]);
		}
		
		txt += '.'+vartype[0]+' '+u(vartype[1])+' ';
		x = x[vartype[0]];
	    }
	}

	//set value
	x[args[ (args.length-2)]] = args[ (args.length-1)];
	
	txt += ' key '+args[ (args.length-2)]+' value '+args[ (args.length-1)];
	
	this.emit(socketID,u('seted',txt));

    }catch(e){
	this.emit(socketID+'err',u(e));
   }
}

const config = function(socketID,args){
    try{
	if( args[3] === undefined){
	    j = require( args[2]);
	}else{
	    j = require( args[2])[ args[3]];
	}
	options.require = args[2];
	options.options = args[3];
	this[name+'_lsconfig'](socketID,args);
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}

const lsconfig = async function(socketID,args){
    this.emit(socketID,u(process.env.npm_package_version));
    try{
	this.emit(socketID,'Require: '+options.require+'\r\nOptions: '+options.options);
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}

module.exports = {
    pkg : {
	author      : 'Alfredo Román',
	license     : 'ISC',
	version     : '0.1',
	compatible  : '0.3.5',
	description : 'Module for control internal memory or Objects'
    },
    command : {
	memo : memoCon
    },
    memo,
    ls,
    set,
    config,
    lsconfig,
    autoload : false
}
