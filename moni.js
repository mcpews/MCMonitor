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
wss.on("connection" , function connection(ws, req) { 
    //客户端与服务器连接时执行的代码块 
	ws.send(JSON.stringify({
		"body": {
			"eventName": "PlayerMessage"
		},
		"header": {
			"requestId": "0ffae098-00ff-ffff-abbbbbbbbbdf3344",
			"messagePurpose": "subscribe",
			"version": 1,
			"messageType": "commandRequest"
		}
	}));
	function command(cmd){ 
        ws.send(JSON.stringify({ 
            "body": { 
                "origin": { 
                    "type": "player" 
                }, 
                "commandLine": cmd, 
                "version": 1 
            }, 
            "header": { 
                "requestId": "add538f2-94c1-422b-8334-41fa5e8778c9", 
                "messagePurpose": "commandRequest", 
                "version": 1, 
                "messageType": "commandRequest" 
            } 
        })); 
	} 
	const ip = req.connection.remoteAddress;
	console.log(ip +" connected.");
	command("tell @s §lMCMonitor connected!\nYour local IP is " + ip.replace("::ffff:",""));
    ws.on("message" , function incoming(message) { 
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
