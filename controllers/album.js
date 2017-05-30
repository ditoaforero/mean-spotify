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
function getAlbum(req, res){
    console.log('Llego a getAlbum');
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec(function (err, album) {
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if(!album){
                res.status(404).send({
                    message: 'No existe el album'
                });
            } else {
                res.status(200).send({
                    album: album
                });
            }
        }
    })
}

function getAlbums(req, res){
    var artistId = req.params.id;

    if(!artistId){
        //Sacar todos los albums de la base de datos
        var find = Album.find({}).sort('title');

    } else {
        // Sacar los albums de un artista en concreto de la base de datos
        var find = Album.find({
            artist: artistId
        }).sort('year');
    }

    find.populate({
        path: 'artist'
    }).exec(function(err, albums){
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        }else{
            if(!albums){
                res.status(404).send({
                    message: 'No existen el albums'
                });
            }else{
                res.status(200).send({
                    albums: albums
                });
            }
        }
    })
}

function saveAlbum(req, res){

    console.log('Llego a saveAlbum');
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    console.log(album);

    album.save(function(err, albumStored){
       if(err){
           res.status(500).send({
               message: 'Error en la petició'
           });
       } else {
           if(!albumStored){
               res.status(404).send({
                   message: 'No se ha guardado el album'
               });
           } else {
               res.status(200).send({
                   album: albumStored
               });
           }
       }
    });
}

function updateAlbum(req, res){
    console.log('Llego a updateAlbum');
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update, function (err, albumUpdated) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!albumUpdated){
                res.status(404).send({
                    message: 'No se ha actualizado el album'
                });
            } else {
                res.status(200).send({
                    album: albumUpdated
                });
            }

        }
    })
}


function deleteAlbum(req, res){
    console.log('Llego a deleteAlbum');

    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId,function (err, albumRemoved) {
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

                Song.find({album: albumRemoved._id}).remove(function (err, songRemoved) {
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
                                album: albumRemoved
                            });
                        }
                    }
                })

            }
        }
    })



}


module.exports = {
    getAlbum : getAlbum,
    getAlbums: getAlbums,
    saveAlbum: saveAlbum,
    updateAlbum: updateAlbum,
    deleteAlbum: deleteAlbum
}