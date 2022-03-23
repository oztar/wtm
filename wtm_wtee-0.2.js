'use strict'

const u = require('util').format;
const name = __filename.split(/[\\/]/).pop().replace('.js','');
let ee = {};
let options = {};

const pkg = {
    author      : 'Alfredo Román',
    license     : 'ISC',
    version     : '0.2',
    compatible  : '0.3.5',
    description : 'Module for EventEmitter simple gestion.'
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


/*
  command nee
*/
const neeCon = {
    version : '0.1',
    description : 'nee List event Evemitters on listen',
    usage : 'nee [config|emit|ls|lsconfig]',
    auto  : ['config','emit','ls','lsconfig']//['option1','option2']  //or null
}

neeCon.usage += '\r\n\tconfig\t\t\tConfigure your variable EventEmiter in module';
neeCon.usage += '\r\n\t\t\t\t\tconfig <require> <.option>';
neeCon.usage += '\r\n\t\t\t\t\tExample:';
neeCon.usage += '\r\n\t\t\t\t\t\tnee config ./services ee\t\t\t javascript code -> require(./services).ee ';
neeCon.usage += '\r\n\t\t\t\t\t\tnee config ./MyEvents\t\t\t\t javascript code -> require(./MyEvents)';
neeCon.USage += '\r\n\tlsconfig\tList options, configure';
neeCon.usage += '\r\n\tls\t\tList all listenings your variable  Events Emitter';
neeCon.usage += '\r\n\temit\t\tEmit event Manual';
neeCon.usage += '\r\n\temit\t\tnee emit <name event> [<option1>] [<option2>] [<option3>] ... [<optionN>]';
neeCon.usage += '\r\n\t\t\t\t\tExample:';
neeCon.usage += '\r\n\t\t\t\t\t\tnee emit event:example hola mundo\t javascript code -> **.emit(\'event:example\',\'hola\',\'mundo\')';
neeCon.usage += '\r\n\t\t\t\t\t\tnee emit example:start\t\t\t\t javascript code -> **.emit(\'example:start\')';


const nee = function(socketID,args){
    try{
	if( this[name+'_'+args[1] ] !== undefined){
	    this[name+'_'+args[1]](socketID,args);
	    return;
	}
	this.emit(socketID+'err','Help usage nee');
    }catch(e){
	this.emit(socketID+'err',e);
   }
}
const emit = function(socketID,args){
    if( args[2] ===  undefined){this.emit(socketID+'err',u(errors['EVENT'],'empty')); return;}
    if( ee._events[ args[2] ] === undefined){  this.emit(socketID+'err',u(errors['EVENT'],args[2])); return;}
    if( args[3] === undefined){ 
	ee.emit(args[2]);
    }else{
	try{
	    args = args.slice(2,args.length);
	    this.emit(socketID,u(args));
	    ee.emit.apply(ee,args);
	}catch(e){
	    this.emit(socketID+'err',u(e));
	}
    }
    this.emit(socketID,'send event by terminal');
}

const config = function(socketID,args){
    try{
	if( args[3] === undefined){
	    ee = require( args[2]);
	}else{
	    ee = require( args[2])[ args[3]];
	}
	options.require = args[2];
	options.options = args[3];
	this[name+'_lsconfig'](socketID,args);
	if( ee._events !== undefined){
	    this.options.list_auto_command['nee emit'] = [];
	    for( let eve in ee._events){
		this.options.list_auto_command['nee emit'].push(eve);
	    }
	    this.emit('send_autocomplete','nee emit',this.options.list_auto_command['nee emit']);
	}
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}

const lsconfig = async function(socketID,args){
    try{
	this.emit(socketID,'Require: '+options.require+'\r\nOptions: '+options.options);
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}

const ls = function(socketID,args){
    try{
	let who = 'Node Event Emitter :\r\n';
	if( ee._events === undefined){
	    this.emit(socketID+'err','not configure Event Emitter\r\n Use nee config <require> <option>'); 
	    return;
	}
	for( let eve in ee._events){
	    who += '\t'+eve+'\r\n';
	}
	this.emit(socketID,who);
    }catch(e){
	this.emit(socketID+'err',e);
   }
}

/*
  command sendee
*/

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



/*
  command whoami
*/
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


/*
  command tty 
*/
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
	iee    : ieeCon,
	whoami : whoamiCon,
	tty    : ttyCon,
	sendee : sendeeCon,
	nee    : neeCon
    },
    iee,
    whoami,
    tty,
    sendee,
    nee,
    emit,
    ls,
    config,
    lsconfig,
    autoload : false
}
