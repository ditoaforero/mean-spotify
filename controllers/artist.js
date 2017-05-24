'use strict'

// Para trabajar con ficheros
var path = require('path');
var fs = require('fs');

// Se importan los modelos de datos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Modulo de paginacion
var mongoosePaginate = require('mongoose-pagination');


// Obtener un artista de la base de datos
function getArtist(req, res){

    var artistId = req.params.id;
    Artist.findById(artistId, function (err,artist) {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else
        {
            if(!artist){
                res.status(404).send({
                    message: 'El artista no existe'
                });
            } else {
                res.status(200).send({
                    artist: artist
                });
            }
        }
    })
}

function getArtists(req, res){

    if(req.params.page){
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemPerPage = 3;

    Artist.find().sort('name').paginate(page, itemPerPage, function (err, artists, total) {
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if(!artists){
                res.status(400).send({
                    messsage: 'No hay artistas'
                });
            } else {
                return res.status(200).send({
                    total_registos: total,
                    numero_pagina: page,
                    artists: artists
                });
            }
        }
    })

}

function saveArtist(req, res){
    var artist = new Artist();


    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save(function(err, artistStored){
        if(err){
            res.status(500).send({
                message: 'Error al guarddar el artista'
            });
        } else {
           if(!artistStored){
                res.status(404).send({
                    message: 'El artista no ha sido guardado'
                });
            } else {
                res.status(200).send({
                    artist: artistStored
                });
            }

        }
    });
}


function updateArtist(req, res){
    var artisId = req.params.id;
    var update = req.body;
    
    Artist.findByIdAndUpdate(artisId, update, function (err, artistUpdated) {
        if(err){
            res.status(500).send({
                message: 'Error al actualizar el artista'
            });
        } else {
            if(!artistUpdated){
                res.status(404).send({
                    message: 'El artista no ha sido actualizado'
                });
            } else {
                res.status(200).send({
                    artist: artistUpdated
                });
            }
        }
    })

}


function deleteArtist(req, res){
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, function (err, artistRemoved) {
        if(err){
            res.status(500).send({
                message: 'Error al eliminar el artista'
            });
        } else {
            if(!artistRemoved){
                res.status(404).send({
                    message: 'El artista no ha sido eliminado'
                });
            } else {
                console.log(artistRemoved);


                Album.find({
                    artist: artistRemoved._id
                }).remove(function (err, albumRemoved) {
                    if(err){
                        res.status(500).send({
                            message: 'Error al eliminar el album'
                        });
                    } else {
                        if(!albumRemoved){
                            res.status(404).send({
                                message: 'El abum no ha sido eliminado'
                            });
                        } else {

                            Song.find({
                                album: albumRemoved._id
                            }).remove(function (err, songRemoved) {
                                if(err){
                                    res.status(500).send({
                                        message: 'Error al eliminar la canción'
                                    });
                                } else {
                                    if(!songRemoved){
                                        res.status(404).send({
                                            message: 'La canción no ha sido eliminada'
                                        });
                                    } else {
                                        res.status(200).send({
                                            artistRemoved: artistRemoved
                                        });
                                    }
                                }
                            })

                        }
                    }
                })
            }
        }
    });
}


function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

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
            Artist.findByIdAndUpdate(artistId, {
                image: file_name
            }, function (err, artistUpdated) {
                if(err){
                    res.status(500).send({
                        message: 'Error al actualizar el artista'
                    });
                } else {
                    if(!artistUpdated){
                        res.status(404).send({
                            message: 'El artista no ha sido actualizado'
                        });
                    } else {
                        res.status(200).send({
                            artist: artistUpdated
                        });
                    }
                }
            })
        } else {
            // Si el tipo de extension de la imagen no corresponde a una imagen
            res.status(200).send({
                message: 'Extension de imagen incorrecta'
            });
        }
        console.log(file_ext);
    } else {
        res.status(200).send({
            message: 'No se ha subido ningun mensaje'
        });
    }

}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/'+imageFile;
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
    getArtist: getArtist,
    getArtists: getArtists,
    saveArtist: saveArtist,
    updateArtist: updateArtist,
    deleteArtist: deleteArtist,
    uploadImage: uploadImage,
    getImageFile: getImageFile
};

