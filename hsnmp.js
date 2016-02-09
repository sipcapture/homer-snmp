/*
* HOMER SNMP Bridge
* http://sipcapture.org
* (c) QXIP BV
*/ 

var version = '0.1';
var debug = true;

var os = require('os');
var snmp = require('snmpjs');
var agent = snmp.createAgent();
var request = require('request');
var jar = request.jar();
var homercookie = request.cookie("HOMERSESSID="+Math.random().toString(36).slice(2)+"; path=/");
jar.add(homercookie);

/********************** 
	OPTIONS 
**********************/

var _config_ = require("./config");
var apiUrl = _config_.apiUrl;
var apiUser = _config_.apiUser;
var apiPass = _config_.apiPass;

/********************** 
	FUNCTIONS 
**********************/

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
	  }
    });
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



/********************** 
	OIDs 
**********************/

// $ snmpget -v 2c -c any localhost .1.3.6.1.2.1.1.5.0
agent.request({ oid: '.1.3.6.1.2.1.1.5', handler: function (prq) {
    var nodename = os.hostname();
    var val = snmp.data.createData({ type: 'OctetString',
        value: nodename });

    snmp.provider.readOnlyScalar(prq, val);
} });


// Test H5 API Bridge
agent.request({ oid: '.1.3.6.1.2.1.1.8', handler: function (prq) {

    request({
	  uri: apiUrl+"session",
	  headers: { "Content-Type": "application/json" },
	  method: "GET",
	  jar: jar
	}, function(error, response, body) {
	  if (debug) console.log(body);
	  var res = JSON.parse(body);
	  sendSNMP(prq,res.status);
    });
} });


/********************** 
	RUN
**********************/

getAuth();
agent.bind({ family: 'udp4', port: 161 });
