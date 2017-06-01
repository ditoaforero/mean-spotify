'use strict'

var mongoose = require('mongoose');
// Para definir un modelo de la base de datos
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

module.exports = mongoose.model('User', UserSchema);