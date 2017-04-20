'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una accion del controlador de Usuarios del API Rest con NodeJS y Mongo'
	});
}

function saveUser(req, res){
	var user = new User();

	// Recoge todos los parametros que llegan por POST
	var params = req.body;

	console.log(params);

	// Se asignan los valores a user
	user.name= params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			if(err){

			}else{
				user.password=hash;
				if(user.name != null && user.surname != null && user.email !=null){
					// Guardar el usuario
					user.save(function(err, userStored){
						if(err){
							res.status(500).send({
								message: "Error al guardar el usuario"
							});					
						}else{
							if(!userStored){
								res.status(404).send({
									message: "No se ha registrado el usuario"
								});			
							}else {
								res.status(200).send({
									user: userStored
								});			
							}	
						}
					});
				} else {
					res.status(200).send({
						message: "Rellena todos los campos"
					});			
				}
			}
		});
	} else {
		res.status(200).send({
			message: "Introduce la contraseña"
		});
	}


}

module.exports = {
	pruebas: pruebas,
	saveUser: saveUser
};