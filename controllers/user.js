'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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

function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		} else {
			if(!user){
				res.status(404).send({
					message: 'El usuario no existe'
				});
			} else {
				// Comprobar la contraseña
				bcrypt.compare(password, user.password, (err, check)=>{
					if(check){
						// devolver los datos del usuario logueado
						if(params.gethash){
							// Devolver un token de JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});
						} else {
							res.status(200).send({
								user: user
							});
						}
					} else {
						res.status(404).send({
							message: 'El usuario no se ha podido loguear'
						});	
					}
				})
			}
		}
	});
}

module.exports = {
	pruebas: pruebas,
	saveUser: saveUser,
	loginUser: loginUser
};