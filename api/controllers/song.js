'use strict'

// Para trabajar con ficheros
var path = require('path');
var fs = require('fs');

// Se importan los modelos de datos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req, res) {

    console.log('Llego a getSong');

    var songId = req.params.id;
    console.log(songId);


    Song.findById(songId).populate({path: 'album'}).exec(function (err, song) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!song){
                res.status(404).send({
                    message: 'La canción no existe'
                });
            }else{
                res.status(200).send({
                    song: song
                });
            }
        }
    });

}

function getSongs(req, res){
    console.log('Llego a getSongs');



    var albumId = req.params.id;


    if(!albumId){
        var find = Song.find({}).sort('number');
    } else{
        var find = Song.find({
            album: albumId
        }).sort('number');
    }

    find.populate({path: 'album', populate:{path: 'artist'}}).exec(function(err, songs){
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        }else {
            if(!songs){
                res.status(404).send({
                    message: 'No existen canciones'
                });
            } else {
                res.status(200).send({
                    songs: songs
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



function saveSong(req, res) {
    console.log('Llego a saveSong');
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save(function (err, songStored) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songStored){
                res.status(404).send({
                    message: 'No se ha guardado la cancion'
                });
            }else{
                res.status(200).send({
                    song: songStored
                });
            }
        }
    })
}

function updateSong(req, res){
    console.log('Llego a updateSong');

    var songId = req.params.id;
    var update = req.body;


    Song.findByIdAndUpdate(songId, update, function (err, songUpdated) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songUpdated){
                res.status(404).send({
                    message: 'No se ha actualizado la canción'
                });
            }else{
                res.status(200).send({
                    song: songUpdated
                });
            }
        }
    })
}



function deleteSong(req, res){
    console.log('Llego a deleteSong');

    var songId = req.params.id;
    Song.findByIdAndRemove(songId, function(err, songRemoved){
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songRemoved){
                res.status(404).send({
                    message: 'La canción no ha sido eliminado'
                });
            } else {
                res.status(200).send({
                    song: songRemoved
                });
            }
        }
    })

}


function uploadFile(req, res) {

    console.log('Llego a uploadFile de Song');
    var songId = req.params.id;
    var file_name = 'No subido...';


    console.log(req.files);

    if(req.files){
        var file_path = req.files.file.path;
        // Para separar las palabras
        var file_split = file_path.split('/');
        // Toma la tercera posicion
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext=='mp3' || file_ext=='ogg'){
            // Se actualiza la imagen
            Song.findByIdAndUpdate(songId, {file: file_name}, function (err, songUpdated) {
                if(err){
                    res.status(500).send({
                        message: 'Error al actualizar la canción'
                    });
                } else {
                    if(!songUpdated){
                        res.status(404).send({
                            message: 'La cancion no se ha actualizado'
                        });
                    } else {
                        res.status(200).send({
                            song: songUpdated
                        });
                    }
                }
            })
        } else {
            // Si el tipo de extension de la imagen no corresponde a una imagen
            res.status(200).send({
                message: 'Extension de canción incorrecta'
            });
        }
        console.log(file_ext);
    } else {
        res.status(200).send({
            message: 'No se ha subido ninguna canción'
        });
    }

}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;
    console.log(path_file);
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la canción...'
            });
        }
    })
}




module.exports = {
    getSong: getSong,
    getSongs: getSongs,
    saveSong: saveSong,
    updateSong: updateSong,
    deleteSong: deleteSong,
    uploadFile: uploadFile,
    getSongFile: getSongFile
}