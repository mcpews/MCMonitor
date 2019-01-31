


function genUUID() {
	　　var ac = "0123456789abcdef";
	　　var id="";
	　　function flen(len){for (let i = 0; i < len; i++) {
		　　　　id += ac.charAt(Math.floor(Math.random() * ac.length));
		　　}}
	flen(8);id+="-";flen(4);id+="-";flen(4);id+="-";flen(4);id+="-";flen(12);
	　　return id;
}


try{
var wes=require("ws");
var portm = 10086
var wss=new wes.Server({port:portm});
const os = require("os");
var localhost = ''
var i = 0;
var obj;
try {
    var network = os.networkInterfaces()
    localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
    localhost = 'localhost'
}
console.log("MCMonitor is running, please connect Client to "+ localhost + ":" + portm);
}catch(errst){
console.log("Error when loading ws: %s.",errst.message);
process.exit(1);
}
wss.on("connection" , function (ws, req) { 
    //客户端服务器连接时执行的代码块 
	ws.send(JSON.stringify({
		"body": {
			"eventName": "PlayerMessage"
		},
		"header": {
			"requestId": genUUID(),//"0ffae098-00ff-ffff-abbbbbbbbbdf3344",
			"messagePurpose": "subscribe",
			"version": 1,
			"messageType": "commandRequest"
		}
	}));
	var callbacks=[];
	function findempty(array){
		let emp=null;
		array.forEach(function(e,i){
			if(emp!=null)return;
			if(e=="died"){
				emp=i;
			}});
		return emp;
	}
	function command(cmd,cb){
		var iiid=genUUID();
        ws.send(JSON.stringify({ 
            "body": { 
                "origin": { 
                    "type": "player" 
                }, 
                "commandLine": cmd, 
                "version": 1 
            }, 
            "header": { 
                "requestId": iiid,//genUUID(),//"add538f2-94c1-422b-8334-41fa5e8778c9", 
                "messagePurpose": "commandRequest", 
                "version": 1, 
                "messageType": "commandRequest" 
            }
        }));
		if(cb!=undefined){
		var empty=findempty(callbacks);
		if(empty!=null){
			callbacks.splice(empty,1,[iiid,cb]);
		}else{
			callbacks.push([iiid,cb]);
		}}
	}

function findcb(uid){
	let calb=null;
	callbacks.forEach((e,i)=>{
		if(e=="died")return;
		if(uid==e[0]){calb=[e[1],i]}
	});
	return calb;
}

	const ip = req.connection.remoteAddress;
	console.log(ip +" connected.");
	//TODO:Tell Torrekie how to use callback xD
	//command("say",function(msg){console.log("Callback>>>>>> %s",msg});
	command("tell @s §lMCMonitor connected!\nYour local IP is " + ip.replace("::ffff:",""));
    ws.on("message" , function (message) {
		console.log(message);
	    let msg=JSON.parse(message);
	    if(msg.header.messagePurpose=="commandResponse"){
	    let callback=findcb(msg.header.requestId);
	    if(callback!=null){
		    callback[0](msg);
		    callbacks[callback[1]]="died";
	    }
	    }
		if (JSON.parse(message).body.eventName == "PlayerMessage") { 
		var spl=JSON.parse(message).body.properties.Message.split(" ");
		if (spl[0] == "stop") {
			command("tell @s Terminating...");
			ws.terminate();
		}
		if (spl[0] == "kill"){
			command("kill @a");
			console.log("killed all the player.");
		}
					if (JSON.parse(message).body.properties.Message.substring(0, 2) == "./") {
				command(JSON.parse(message).body.properties.Message.split("/")[1]);
			}
		console.log("<%s>", JSON.parse(message).body.properties.Sender, JSON.parse(message).body.properties.Message);
        }
    }); 
}); 
