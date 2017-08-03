'use strict';
var database = require('modules/database');
var utils = require('modules/common');
const crypto = require('crypto');
var session = require('controllers/session');

module.exports = {
	createapp:createApplication
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


function listUsers(req, res) {
	if (req.swagger.params.AdminKey.value===ADMINKEY) {
		database.connect()
		.then(function(db) {
			var result=new Array();
			db.collection('users').find().forEach(function(user) {
				delete user._id;
				delete user.id;
				delete user.password
				result.push(user);
				console.log(user);
				console.log("Adding an user : "+ user.userid);
			}, function(error) {
				console.log("End of forEach");
				db.close();
				console.log(JSON.stringify(result));
				res.statusCode=200;
				res.json(result);
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
function getUser(req, res) {
	if (req.swagger.params.AdminKey.value===ADMINKEY) {
		database.connect()
		.then(function(db) {
			db.collection('users').findOne({"login": req.swagger.params.userid.value}).then(function(user) {
				if ((user===null) || (user === undefined)) {
					res.statusCode=404;
					var message={'code': 404, 'message': 'User not found'};
					res.json(message);
				} else {
					delete user._id;
					delete user.password;
					db.close();
					console.log(JSON.stringify(user));
					res.statusCode=200;
					res.json(user);
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

function getUserMe(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			db.collection('users').findOne({"login": login}).then(function(user) {
				if ((user===null) || (user === undefined)) {
					res.statusCode=404;
					var message={'code': 404, 'message': 'User not found'};
					res.json(message);
				} else {
					delete user._id;
					delete user.password;
					db.close();
					console.log(JSON.stringify(user));
					res.statusCode=200;
					res.json(user);
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
			res.statusCode=403;
			var message={'code': 403, 'message': 'You are not allowed to execute this request'};
			res.json(message);
		});

	})
	.catch(function(err) {
		console.log(err);
		res.statusCode=500;
		var message={'code': 500, 'message': 'We have a database issue'};
		res.json(message);
	});
}

function deleteUser(req, res) {
	if (req.swagger.params.AdminKey.value===ADMINKEY) {
		database.connect()
		.then(function(db) {
			db.collection('users').deleteMany({"login": req.swagger.params.userid.value}).then(function() {
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

function updateUser(req, res) {
	if (req.swagger.params.AdminKey.value===ADMINKEY) {
		database.connect()
		.then(function(db) {
			var user={};
			user.password=utils.passwd(req.body.password);
			db.collection('users').findAndModify({"login": req.swagger.params.userid.value},{},{$set: user}).then(function(result){
				db.collection('users').findOne({"login": req.swagger.params.userid.value}).then(function(user) {
					if ((user===null) || (user === undefined)) {
						res.statusCode=404;
						var message={'code': 404, 'message': 'User not found'};
						res.json(message);
					} else {
						delete user._id;
						delete user.password;
						db.close();
						console.log(JSON.stringify(user));
						res.statusCode=200;
						res.json(user);
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

function updateUserMe(req, res) {
	database.connect()
	.then(function(db) {
		session.checkSession(db, req.swagger.params.session.value).then(function(login) {
			console.log("Session : "+req.swagger.params.session.value+"  -  Login: "+login);
			var user={};
			user.password=utils.passwd(req.body.password);
			db.collection('users').findAndModify({"login": login},{},{$set: user}).then(function(result){
				db.collection('users').findOne({"login": login}).then(function(user) {
					if ((user===null) || (user === undefined)) {
						res.statusCode=404;
						var message={'code': 404, 'message': 'User not found'};
						res.json(message);
					} else {
						delete user._id;
						delete user.password;
						db.close();
						console.log(JSON.stringify(user));
						res.statusCode=200;
						res.json(user);
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
