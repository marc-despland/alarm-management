'use strict';
var database = require('modules/database');
var users = require('./users');
var utils = require('modules/common');
var session = require('controllers/session');
var Client = require('node-rest-client').Client;

module.exports = {
	listIntrusions:listIntrusions,
	deleteIntrusion:deleteIntrusion,
	listImages:listImages,
	downloadImage:downloadImage,
	downloadThumbnailImage:downloadThumbnailImage
};



function listIntrusions(req, res) {
	console.log("listIntrusions");
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
	 
				var args = {
				    headers: { "ApiKey": application.imagesbank.apikey } // request headers 
				};
	 
	 			console.log("Args : "+JSON.stringify(args));
	 			console.log("Url  : "+application.imagesbank.url+"/collections");
				var request=client.get(application.imagesbank.url+"/collections", args, function (data, response) {
				    console.log("OK");
				    db.close();
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


function deleteIntrusion(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
					headers: { "ApiKey": application.imagesbank.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.imagesbank.url+"/collections/"+req.swagger.params.intrusion.value;
	 			console.log("Url  : "+url);
				var request=client.delete(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=200;
					db.close();
					/*var result=data;
					if (result.count === undefined) result=JSON.parse(data.toString());*/
					console.log("Data : "+JSON.stringify(data));
					if (data==="") {
						console.log("Data : is null");
						res.contentType("application/json");
						res.end();
					} else {
						console.log("Data : is not null");
						if (data.code!==undefined) {
							res.statusCode=data.code;
						}
						res.json(data);
					}
				});
				request.on('requestTimeout', function (req) {
	    			console.log('request has expired');
	    			db.close();
	    			request.abort();
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

function listImages(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
				    headers: { "ApiKey": application.imagesbank.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.imagesbank.url+"/collections/"+req.swagger.params.intrusion.value+"/images";
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=200;
					console.log(response);
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


function downloadImage(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
				    headers: { "ApiKey": application.imagesbank.apikey } // request headers 
				};
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.imagesbank.url+"/collections/"+req.swagger.params.intrusion.value+"/images/"+req.swagger.params.imageid.value;
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=response.statusCode;
					res.contentType(response.headers["content-type"]);
					console.log("Content-Type: "+response.headers["content-type"]);
					console.log(data);
					res.send(data);
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


function downloadThumbnailImage(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			utils.getApplication(db,req.swagger.params.applicationid.value).then(function(application){
				var client = new Client();
				var args = {
					parameters: {},
				    headers: { "ApiKey": application.imagesbank.apikey } // request headers 
				};
				if (req.swagger.params.width.value!==undefined) args.parameters.width=req.swagger.params.width.value;
	 			console.log("Args : "+JSON.stringify(args));
	 			var url=application.imagesbank.url+"/collections/"+req.swagger.params.intrusion.value+"/images/"+req.swagger.params.imageid.value+"/thumbnail";
	 			console.log("Url  : "+url);
				var request=client.get(url, args, function (data, response) {
				    console.log("OK");
					res.statusCode=response.statusCode;
					res.contentType(response.headers["content-type"]);
					console.log("Content-Type: "+response.headers["content-type"]);
					console.log(data);
					res.send(data);
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
