'use strict';
var database = require('modules/database');
var utils = require('modules/common');
const crypto = require('crypto');
var session = require('controllers/session');

module.exports = {
	createapp:createApplication,
	listapp:listApplication,
	getapp:getApplication,
	deleteapp:deleteApplication,
	updateapp:updateApplication
};



function createApplication(req, res) {
	if (req.swagger.params.AdminKey.value===utils.ADMINKEY) {
		database.connect()
		.then(function(db) {
			var app=req.body;
			db.collection('applications').insertOne(app)
			.then(function(result) {
				db.close();
				console.log(result);
				res.statusCode=201;
				res.contentType("application/json");
				console.log('saved to database');
				app.id=result.insertedId;
				delete app._id;
				res.json(app);
			})
			.catch(function(err) {
				db.close();
				console.log(err);
				res.statusCode=500;
				var message={'code': 500, 'message': err};
				res.json(message);
			});
		})
		.catch(function(err) {
			console.log(err);
			res.statusCode=500;
			var message={'code': 500, 'message': 'We have a database issue'};
			res.json(message);
		});
	} else {
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);		
	}

}


function listApplication(req, res) {
	database.connect()
	.then(function(db) {
		session.checkAdminOrSession(db, req.swagger.params.AdminKey.value, req.swagger.params.session.value).then(function() {
			var result=new Array();
			db.collection('applications').find().forEach(function(app) {
				var elt={};
				elt.id=app._id;
				elt.name=app.name;
				result.push(elt);
				console.log(elt);
				console.log("Adding an application : "+ elt.id);
			}, function(error) {
				console.log("End of forEach");
				db.close();
				console.log(JSON.stringify(result));
				res.statusCode=200;
				res.json(result);
			});
		}).catch(function(err){
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);		
		});
		
	}).catch(function(err) {
		console.log(err);
		res.statusCode=500;
		var message={'code': 500, 'message': 'We have a database issue'};
		res.json(message);
	});

}
function getApplication(req, res) {
	if (req.swagger.params.AdminKey.value===utils.ADMINKEY) {
		database.connect()
		.then(function(db) {
			db.collection('applications').findOne({"_id": database.objectid(req.swagger.params.applicationid.value)}).then(function(app) {
				if ((app===null) || (app === undefined)) {
					res.statusCode=404;
					var message={'code': 404, 'message': 'User not found'};
					res.json(message);
				} else {
					app.id=app._id;
					delete app._id;
					db.close();
					console.log(JSON.stringify(app));
					res.statusCode=200;
					res.json(app);
				}
			}).catch(function(err) {
				console.log(err);
				res.statusCode=500;
				var message={'code': 500, 'message': 'We have a database issue'};
				res.json(message);
			});

		})
		.catch(function(err) {
			console.log(err);
			res.statusCode=500;
			var message={'code': 500, 'message': 'We have a database issue'};
			res.json(message);
		});
	} else {
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);		
	}

}


function deleteApplication(req, res) {
	if (req.swagger.params.AdminKey.value===utils.ADMINKEY) {
		database.connect()
		.then(function(db) {
			db.collection('applications').deleteMany({"_id": database.objectid(req.swagger.params.applicationid.value)}).then(function() {
				db.close();
				res.statusCode=200;
				res.contentType("application/json");
				res.end();
			}).catch(function(err) {
				console.log(err);
				res.statusCode=500;
				var message={'code': 500, 'message': 'We have a database issue'};
				res.json(message);
			});
		})
		.catch(function(err) {
			console.log(err);
			res.statusCode=500;
			var message={'code': 500, 'message': 'We have a database issue'};
			res.json(message);
		});
	} else {
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);		
	}

}

function updateApplication(req, res) {
	if (req.swagger.params.AdminKey.value===utils.ADMINKEY) {
		database.connect()
		.then(function(db) {
			var app=req.body;
			delete app.id;
			db.collection('applications').findAndModify({"_id": database.objectid(req.swagger.params.applicationid.value)},{},{$set: app}).then(function(result){
				db.collection('applications').findOne({"_id": database.objectid(req.swagger.params.applicationid.value)}).then(function(app) {
					if ((app===null) || (app === undefined)) {
						res.statusCode=404;
						var message={'code': 404, 'message': 'User not found'};
						res.json(message);
					} else {
						app.id=app._id;
						delete app._id;
						db.close();
						console.log(JSON.stringify(app));
						res.statusCode=200;
						res.json(app);
					}
				}).catch(function(err) {
					console.log(err);
					res.statusCode=500;
					var message={'code': 500, 'message': 'We have a database issue'};
					res.json(message);
				});
			}).catch(function(err) {
				console.log(err);
				res.statusCode=500;
				var message={'code': 500, 'message': 'We have a database issue'};
				res.json(message);
			});
		}).catch(function(err) {
			console.log(err);
			res.statusCode=500;
			var message={'code': 500, 'message': 'We have a database issue'};
			res.json(message);
		});

	} else {
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);		
	}

}
