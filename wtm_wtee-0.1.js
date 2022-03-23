'use strict'

const u = require('util').format;

const pkg = {
    author      : 'Alfredo Roman',
    license     : 'ISC',
    version     : '0.1',
    compatible  : '0.3.5',
    description : 'Module for EventEmitter gestion, and emit manual. '
};

const errors = {
    CLIENT : 'The "%s" id not connected or disconected',
    EVENT  : 'this "%s" event is necesary exist'
}

const ieeCon = {
    version : '0.1',
    description : 'iee List event Evemitters on listen',
    usage : 'iee',
    auto  : null//['option1','option2']  //or null
}

const iee = function(socketID,args){
    try{
	let who = 'Internal Event Emitter:\r\n';
	for( let eve in this._events){
	    who += '\t'+eve+'\r\n';
	}
	this.emit(socketID,who);
    }catch(e){
	this.emit(socketID+'err',e);
   }
}

const sendeeCon = {
    verison : '0.1',
    description : 'sendee emit event manual',
    usage : 'sendee [nameEvent] [arguments]',
    auto  : null//['option1','option2']  //or null
}
sendeeCon.usage += '\r\n\tExample:';
sendeeCon.usage += '\r\n\t\tsendee save:config {wtee:true}';

const sendee = function(socketID,args){
    if( this._events[ args[1] ] === undefined){  this.emit(socketID+'err',u(errors['EVENT'],args[1])); return;}
    if( args[2] === undefined){ 
	this.emit(args[1]);
    }else{
	try{
	    args = args.slice(1,args.length);
	    this.emit(socketID,u(args));
	    this.emit.apply(this,args);
	}catch(e){
	    this.emit(socketID+'err',u(e));
	}
    }
    this.emit(socketID,'send event by terminal');
}

const whoamiCon = {
    version : '0.1',
    description : 'whoami. Information websocket',
    usage : 'whoami',
    auto : null
}

const whoami = function(socketID,args){
    try {
	let who = 'User Socket Dats\r\n';
	who += 'ID: '+socketID+'\r\n';
	who += 'IP: '+this.client_socket[socketID].handshake.address+'\r\n';
	who += 'host: '+this.client_socket[socketID].handshake.headers.host+'\r\n';
	who += 'namespace: '+this.client_socket[socketID].nsp.name+'\r\n';
	who += 'protocol: '+this.client_socket[socketID].client.conn.protocol+'\r\n';
	who += 'InternalEvents: \r\n';
	for( let eve in this.client_socket[socketID]._events){
	    who += '\t'+eve+'\r\n';
	}
	who += 'Clients: \r\n';
	who += '\thttp: '+this.client_socket[socketID].server.httpServer._connections+'\r\n';
	who += '\tsocket: '+this.client_socket[socketID].server.engine.clientsCount+'\r\n';

	this.emit(socketID,who);
    }catch(e){
	this.emit(socketID+'err',e);
    }
}

const ttyCon = {
    version : '0.1',
    description : 'send msg to other user conected in terminal ',
    usage : 'tty <id conn User> <message>',
    auto : null
}

ttyCon.usage += '\r\n\tExample:';
ttyCon.usage += '\r\n\t\tty xcojnwojns Hello Every One';


const tty = function(socketID,args){
    if( args[1] === undefined){ this.emit(socketID+'err','need id other user'); return;}
    if( args[2] === undefined){ this.emit(socketID+'err','msg not empty'); return;}
    if( this.client_socket[ args[1] ] === undefined){ this.emit(socketID+'err',u( errors['CLIENT'],args[1]));return;}    
    let msg = 'User ['+socketID+'] say: ';
    for( let i=2 ; i < args.length; i++){	
	msg +=args[i]+' ';
    }
    this.emit(args[1],msg);
    this.emit(socketID,'send msg');
}

module.exports = {
    pkg,
    command : {
	iee : ieeCon,
	whoami : whoamiCon,
	tty : ttyCon,
	sendee : sendeeCon
    },
    iee,
    whoami,
    tty,
    sendee,
    autoload : false
}
