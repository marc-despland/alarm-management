'use strict';
var database = require('modules/database');
var users = require('./users');
var utils = require('modules/common');
var session = require('controllers/session');
var Client = require('node-rest-client').Client;
var sharp = require('sharp');


module.exports = {
	downloadLiveImage:downloadLiveImage,
	getAlarmStatus:getAlarmStatus,
	toggleAlarmPause:toggleAlarmPause
};

function downloadLiveImage(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
				    headers: { "ApiKey": application.alarm.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.alarm.url+"/image";
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
				    db.close();
					res.statusCode=response.statusCode;
					res.contentType(response.headers["content-type"]);
					console.log("Content-Type: "+response.headers["content-type"]);

					if (req.swagger.params.width.value!== undefined) {
						var transformer = sharp(data).resize(req.swagger.params.width.value).on('info', function(info) {
    						console.log('Image height is ' + info.height);
  						});
  						transformer.pipe(res);
  					} else {
  						res.send(data);
  					}
					
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
				db.close();
				res.statusCode=500;
				var message={'code': 500, 'message': error};
				res.json(message);
			});
		}).catch(function(error){
			console.log(error);
			db.close();
			res.statusCode=500;
			var message={'code': 500, 'message': error};
			res.json(message);
		});
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});
}


function getAlarmStatus(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
				    headers: { "ApiKey": application.alarm.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.alarm.url+"/status";
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
				    db.close();
					res.statusCode=response.statusCode;
					res.contentType(response.headers["content-type"]);
					if (data.intrusion===0) {
						data.intrusion=false;
					} else {
						data.intrusion=true;
					}
					if (data.pause===0) {
						data.pause=false;
					} else {
						data.pause=true;
					}
					res.send(data);
					
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
				db.close();
				res.statusCode=500;
				var message={'code': 500, 'message': error};
				res.json(message);
			});
		}).catch(function(error){
			console.log(error);
			db.close();
			res.statusCode=500;
			var message={'code': 500, 'message': error};
			res.json(message);
		});
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});
}


function toggleAlarmPause(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
				    headers: { "ApiKey": application.alarm.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.alarm.url+"/pause";
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
				    db.close();
					res.statusCode=response.statusCode;
					res.contentType(response.headers["content-type"]);
					res.send(data);
					
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			db.close();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
				db.close();
				res.statusCode=500;
				var message={'code': 500, 'message': error};
				res.json(message);
			});
		}).catch(function(error){
			console.log(error);
			db.close();
			res.statusCode=500;
			var message={'code': 500, 'message': error};
			res.json(message);
		});
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});
}
