'use strict';
var util = require('util');
var database = require('modules/database');
const crypto = require('crypto');

var ADMINKEY=process.env.ADMIN_KEY || "efec80962d1221715bb7543a791258fea80f3331b0d0c4c3636fde03a71f978e";


//Be careful, if you change the password key, the existing user password will become invalid
var PASSWORD_KEY=process.env.PASSWORD_KEY || "258fea80f3331b0";


module.exports = {
	checkpasswd:checkpasswd,
	passwd:passwd,
	sha256:sha256,
	ADMINKEY:ADMINKEY
};

function sha256(source) {
	var hash = crypto.createHash('sha256');
	hash.update(source);
	return (hash.digest('base64'));
}

function passwd(source) {
	return (sha256(source+PASSWORD_KEY));
}

function checkpasswd(db,login, password) {
	return new Promise(function(resolve, reject) {
		db.collection('users').findOne({"login": login}).then(function(user) {
			if ((user===null) || (user === undefined)) {
				reject();
			} else {
				if (user.password===passwd(password)) {
					resolve();
				} else {
					reject();
				}
			}
		}).catch(function(err) {
			console.log(err);
			reject();
		});

	});
}
