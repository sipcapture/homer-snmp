/*
* HOMER SNMP Bridge
* http://sipcapture.org
* (c) QXIP BV
*
* Official SIPCAPTURE OID: 1.3.6.1.4.1.47235.9000.25
*/ 

var version = '0.1.1';
var debug = false;

var os = require('os');
var snmp = require('snmpjs');
var agent = snmp.createAgent();
var request = require('request');
var jar = request.jar();
var homercookie = request.cookie("HOMERSESSID="+Math.random().toString(36).slice(2)+"; path=/");

/********************** 
	OPTIONS 
**********************/

var _config_ = require("./config");
if(process.argv.indexOf("-c") != -1){
    _config_ = require(process.argv[process.argv.indexOf("-c") + 1]);
}

if(process.argv.indexOf("-d") != -1){
    debug = true; // set debug ON
}

var apiUrl = _config_.apiUrl;
var apiUser = _config_.apiUser;
var apiPass = _config_.apiPass;
var timeOut = _config_.timeOut ? _config_.timeOut : 120 ;

/********************** 
	FUNCTIONS 
**********************/
jar.setCookie(homercookie, 'apiUrl', function(error, cookie) {});
var getAuth = function(){

    var args = { username: apiUser, password: apiPass };
    request({
	  uri: apiUrl+"session",
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  form: args,
	  jar: jar
	}, function(error, response, body) {
          if (!body) {
		console.log('API Error connecting to '+apiUrl);
		console.log('Exiting...'); 
		process.exit(1);
	  } else {
		if (debug) console.log(body);
		if (JSON.parse(body).status == 200){
			 if (debug) console.log('API Auth OK');
		} else { console.log('API Auth Failure!'); process.exit(1); }
	  }
    });

    return;

}

var prepSNMP = function(prq,body){
          try {
		  sendSNMP(prq,JSON.parse(body).data[0].total);
	  } catch(err) { 
		  sendSNMP(prq,'0');
	  }
}

var sendSNMP = function(prq,data,type){
    if (!data) return;
    if (!type) {
	    if (data.substring) {
		var type = 'OctetString';
	    } else {
		var type = 'Integer';
	    }
    }
    var val = snmp.data.createData({ type: type, value: data });
    snmp.provider.readOnlyScalar(prq, val);
}

var sendSNMPtrap = function(json,oid,host){
	if (!host) host = 'localhost';
	var trap = snmp.message.createMessage({
	    version: 0, //this means send a SNMP v1 trap
	    community: "public",
	    pdu: snmp.pdu.createPDU(json),
	});
	trap.encode();
	var socket = dgram.createSocket('udp4');
	socket.send(trap._raw.buf, 0, trap._raw.len, 162, host, function(err, bytes) {
	    if(err) console.log(err);
	    console.log(bytes+" bytes written");
	});
}

/********************** 
	OIDs 
**********************/

// $ snmpget -v 2c -c any localhost {oid}

/* SYSTEM */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.1', handler: function (prq) {
    var param = os.hostname();
    var val = snmp.data.createData({ type: 'OctetString',
        value: param });

    snmp.provider.readOnlyScalar(prq, val);
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.2', handler: function (prq) {
    var param = '' + os.uptime();
    var val = snmp.data.createData({ type: 'OctetString',
        value: param });

    snmp.provider.readOnlyScalar(prq, val);
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.3', handler: function (prq) {
    var param = '' + os.loadavg();
    var val = snmp.data.createData({ type: 'OctetString',
        value: param });

    snmp.provider.readOnlyScalar(prq, val);
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.4', handler: function (prq) {
    var param = '' + os.freemem();
    var val = snmp.data.createData({ type: 'OctetString',
        value: param });

    snmp.provider.readOnlyScalar(prq, val);
} });
agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.5', handler: function (prq) {
    var param = '' + os.totalmem();
    var val = snmp.data.createData({ type: 'OctetString',
        value: param });

    snmp.provider.readOnlyScalar(prq, val);
} });



/* SIPCAPTURE STATISTICS 5min */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.5.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (5 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"packet_count"}]}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.5.2', handler: function (prq) {

    var now = Date.now();
    var from = now - (5 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"packet_size"}]}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.5.3', handler: function (prq) {

    var now = Date.now();
    var from = now - (5 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"asr"}]}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.5.4', handler: function (prq) {

    var now = Date.now();
    var from = now - (5 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"ner"}]}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });


/* SIPCAPTURE STATISTICS 15min */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.15.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (15 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"packet_count"}],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.15.2', handler: function (prq) {

    var now = Date.now();
    var from = now - (15 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"packet_size"}],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.15.3', handler: function (prq) {

    var now = Date.now();
    var from = now - (15 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"asr"}],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.10.15.4', handler: function (prq) {

    var now = Date.now();
    var from = now - (15 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/data",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[{"type":"ner"}],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  prepSNMP(prq,body);
	  // sendSNMP(prq,JSON.parse(body).data[0].total);
    });
} });



/* SIPCAPTURE ALARMS 5min */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.11.5.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (5 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/alarm",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  prepSNMP(prq,body);

    });
} });

/* SIPCAPTURE ALARMS 15min */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.11.15.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (15 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/alarm",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  prepSNMP(prq,body);

    });
} });

/* SIPCAPTURE ALARMS 30min */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.11.30.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (30 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/alarm",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  prepSNMP(prq,body);

    });
} });

/* SIPCAPTURE ALARMS 60m */

agent.request({ oid: '.1.3.6.1.4.1.47235.9000.25.11.60.1', handler: function (prq) {

    var now = Date.now();
    var from = now - (60 * 60 * 1000);
    request({
	  uri: apiUrl+"statistic/alarm",
	  headers: { "Content-Type": "application/json" },
	  form: {"timestamp":{"from":from,"to":now},"param":{"filter":[],"total":true}}, 
	  method: "POST",
	  jar: jar
	}, function(error, response, body) {
	  prepSNMP(prq,body);

    });
} });



/********************** 
	RUN
**********************/

getAuth();
setInterval(function() {
    getAuth();
}, timeOut*1000 );



agent.bind({ family: 'udp4', port: 161 });
