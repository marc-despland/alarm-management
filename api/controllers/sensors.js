'use strict';
var database = require('modules/database');
var users = require('./users');
var utils = require('modules/common');
var session = require('controllers/session');
var Client = require('node-rest-client').Client;

module.exports = {
	listsensors:listsensors,
	getsensordata:getsensordata,
	groupsensordata:groupsensordata
};



function listsensors(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
	 
				var args = {
				    headers: { "ApiKey": application.sensorsbank.apikey } // request headers 
				};
	 
	 			console.log("Args : "+JSON.stringify(args));
	 			console.log("Url  : "+application.sensorsbank.url+"/sensors");
				var request=client.get(application.sensorsbank.url+"/sensors", args, function (data, response) {
				    console.log("OK");
					res.statusCode=200;
					res.json(data);
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
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
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});

}


function getsensordata(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
					parameters: {},
				    headers: { "ApiKey": application.sensorsbank.apikey } // request headers 
				};
	 			if (req.swagger.params.limit.value!==undefined) args.parameters.limit=req.swagger.params.limit.value;
	 			if (req.swagger.params.offset.value!==undefined) args.parameters.offset=req.swagger.params.offset.value;
	 			if (req.swagger.params.order.value!==undefined) args.parameters.order=req.swagger.params.order.value;
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.sensorsbank.url+"/sensors/"+req.swagger.params.sensor.value;
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=200;
					/*var result=data;
					if (result.count === undefined) result=JSON.parse(data.toString());*/
					res.json(data);
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
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
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});
}

function groupsensordata(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
					parameters: {},
				    headers: { "ApiKey": application.sensorsbank.apikey } // request headers 
				};
	 			if (req.swagger.params.year.value!==undefined) args.parameters.year=req.swagger.params.year.value;
	 			if (req.swagger.params.month.value!==undefined) args.parameters.month=req.swagger.params.month.value;
	 			if (req.swagger.params.day.value!==undefined) args.parameters.day=req.swagger.params.day.value;
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.sensorsbank.url+"/sensors/"+req.swagger.params.sensor.value+"/groupby/"+req.swagger.params.groupby.value;
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=200;
					/*var result=data;
					if (result.count === undefined) result=JSON.parse(data.toString());*/
					res.json(data);
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			request.abort();
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request has expired'};
					res.json(message);
				});
	 
				request.on('responseTimeout', function (response) {
	    			console.log('response has expired');
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'response has expired'};
					res.json(message);
	 
				});
	 
				request.on('error', function (err) {
	    			console.log('request error', err);
	    			res.statusCode=500;
					var message={'code': 500, 'message': 'request error : '+ err};
					res.json(message);
				});


			}).catch(function(error){
				console.log(error);
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
	}).catch(function(error){
		console.log(error);
		res.statusCode=500;
		var message={'code': 500, 'message': error};
		res.json(message);
	});
}

