'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

// Para trabajar con los ficheros del sistema
var fs = require('fs');
var path = require('path');
//

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
							}else {surname
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

	User.findOne({email: email.toLowerCase()}, function(err, user){
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
				bcrypt.compare(password, user.password, function(err, check){
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


function updateUser(req, res){
	// Se saca el Id del usuario desde el URL
	var userId = req.params.id;
	// El body que viene de la peticion
	var update = req.body;

	User.findByIdAndUpdate(userId, update, function(err, userUpdated){
		if(err){
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
		} else {
			if(!userUpdated){
                res.status(404).send({
                    message: 'No se a podido actualizar el usuario'
                });
			} else {
                res.status(200).send({
                    user: userUpdated
                });
			}
		}
	});
}

function uploadImage(req, res) {
	console.log('Llego a cargar imagen');
	var userId = req.params.id;
	var file_name ='No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		// Para separar las palabras
		var file_split = file_path.split('/');
		// Toma la tercera posicion
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext=='png' || file_ext=='jpg' || file_ext=='gif'){
            // Se actualiza la imagen
			User.findByIdAndUpdate(userId, { image: file_name}, function (err, userUpdated) {
				if(err){
                    res.status(500).send({
                        message: 'Error en el servidor'
                    });
				} else {
					if(!userUpdated){
                        res.status(404).send({
                            message: 'No se ha podido actualizar el usuario'
                        });
					} else {
                        res.status(200).send({
                            image: file_name,
                        	user: userUpdated
                        });
					}
				}

            });
        } else {
			// Si el tipo de extension de la imagen no corresponde a una imagen
            res.status(200).send({
                message: 'Extension de imagen incorrecta'
            });
        }
	} else {
		res.status(200).send({
			message: 'No se ha subido ningun mensaje'
		});
	}
}


function getImageFile(req, res){
	console.log('Llego a getImageFile');
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	console.log(path_file);
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		} else {
            res.status(200).send({
                message: 'No existe la imagen...'
            });
		}
	})
}


module.exports = {
	pruebas: pruebas,
	saveUser: saveUser,
	loginUser: loginUser,
	updateUser: updateUser,
	uploadImage: uploadImage,
	getImageFile: getImageFile

};