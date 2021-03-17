//seever script for node.js
var serialport = require('serialport'); 
var fs = require('fs'); 
var prompt = require('prompt');
 

//clear terminal
process.stdout.write('\033c');


//display ip4 & ip6 address
var address,os = require('os'),ifaces = os.networkInterfaces();
for (var dev in ifaces) {
	var iface = ifaces[dev].filter(function(details) {
	return details.family === 'IPv4' && details.internal === false;
});
var iface6 = ifaces[dev].filter(function(details) {
	return details.family === 'IPv6' && details.internal === false;
});
if(iface.length > 0) address = iface[0].address;
if(iface6.length > 0) address2 = iface6[0].address;
}
console.log(address); 
console.log(address2);  


//set com port manually 
var comPort = "COM4"; 


//to write uid only once, use lock variable 
var lock = 0; 


//show com ports. arduino should be plugged in.
var myPort = new serialport(comPort, 9600);
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
  });
});
var Readline = serialport.parsers.Readline; 
var parser = new Readline(); 
myPort.pipe(parser); 
myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);
function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.baudRate);
}


//parse incoming data. if line has 'UID' printline & clean up data
//set lock to write to text file jsut once
function readSerialData(data) {
if(data.substr(5,3)=='UID' && lock == 0 ){
	lock =1;
	console.log(data.substr(10,11));   
var uid = data.substr(10,11);    
	fs.writeFile('uid.txt', uid+"\r\n",  {'flag':'a'},  function(err) {
	if (err) {
		return console.error(err);
	}
});

		
console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
}
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}
 
 
